package main

import (
	"log"
	"os"

	"github.com/affiliatedonor/backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize Gin router
	router := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	config.AllowCredentials = true
	router.Use(cors.New(config))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"message": "AffiliateDonor API is running",
		})
	})

	// API routes
	api := router.Group("/api")
	{
		// Causes
		routes.SetupCauseRoutes(api)
		
		// Donations
		routes.SetupDonationRoutes(api)
		
		// Products/Shopping
		routes.SetupProductRoutes(api)
		
		// Payments
		routes.SetupPaymentRoutes(api)
		
		// Affiliates
		routes.SetupAffiliateRoutes(api)
		
		// Users
		routes.SetupUserRoutes(api)

		// Crypto
		routes.SetupCryptoRoutes(api)

		// Blogs
		routes.SetupBlogRoutes(api)
	}

	// WebSocket for real-time updates
	routes.SetupWebSocket(router)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
