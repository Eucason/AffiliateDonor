package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // In production: Validate origin
	},
}

type Client struct {
	conn *websocket.Conn
	send chan []byte
}

var clients = make(map[*Client]bool)
var broadcast = make(chan []byte)

func HandleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}

	client := &Client{
		conn: conn,
		send: make(chan []byte, 256),
	}

	clients[client] = true

	// Start goroutines for reading and writing
	go client.readPump()
	go client.writePump()

	// Send initial connection message
	message := []byte(`{"type":"connected","message":"Connected to AffiliateDonor real-time updates"}`)
	client.send <- message
}

func (c *Client) readPump() {
	defer func() {
		delete(clients, c)
		c.conn.Close()
	}()

	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}
		broadcast <- message
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// BroadcastUpdate sends updates to all connected clients
func BroadcastUpdate(updateType, message string, data interface{}) {
	payload := map[string]interface{}{
		"type":    updateType,
		"message": message,
		"data":    data,
		"time":    time.Now().Unix(),
	}

	// Convert to JSON and broadcast
	// In production: Use proper JSON encoding
	for client := range clients {
		select {
		case client.send <- []byte(message):
		default:
			close(client.send)
			delete(clients, client)
		}
	}
}

func init() {
	// Start broadcast handler
	go handleBroadcasts()

	// Simulate real-time donation updates
	go func() {
		ticker := time.NewTicker(10 * time.Second)
		defer ticker.Stop()

		for range ticker.C {
			BroadcastUpdate("donation", "New donation received", map[string]interface{}{
				"amount":     25.00,
				"cause_name": "Clean Water Initiative",
			})
		}
	}()
}

func handleBroadcasts() {
	for {
		message := <-broadcast
		for client := range clients {
			select {
			case client.send <- message:
			default:
				close(client.send)
				delete(clients, client)
			}
		}
	}
}
