package handlers

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// Mock wallet addresses - in production, these would be generated via Coinbase Commerce or similar
var mockWallets = map[string]string{
	"btc":  "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
	"eth":  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
	"ltc":  "LQTpS7fJPHR9bYW8t5qPz3G7rZB9cKvXm7",
	"usdc": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
	"usdt": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
	"bnb":  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
}

func GenerateCryptoAddress(c *gin.Context) {
	var req struct {
		CryptoType string  `json:"crypto_type" binding:"required"`
		Amount     float64 `json:"amount" binding:"required"`
		UserID     string  `json:"user_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	address, exists := mockWallets[req.CryptoType]
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported cryptocurrency"})
		return
	}

	payment := models.CryptoPayment{
		ID:         "crypto_" + time.Now().Format("20060102150405"),
		UserID:     req.UserID,
		Amount:     req.Amount,
		CryptoType: req.CryptoType,
		Address:    address,
		Status:     "pending",
		CreatedAt:  time.Now(),
	}

	// In production: Store in database and monitor blockchain for payment
	c.JSON(http.StatusOK, gin.H{
		"payment": payment,
		"address": address,
		"qr_data": address, // Frontend will generate QR code
	})
}

func VerifyCryptoPayment(c *gin.Context) {
	var req struct {
		PaymentID string `json:"payment_id" binding:"required"`
		TxHash    string `json:"tx_hash" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production: Verify transaction on blockchain
	// For now, mock verification
	c.JSON(http.StatusOK, gin.H{
		"verified": true,
		"status":   "confirmed",
		"confirmations": 3,
	})
}

func GetCryptoPaymentStatus(c *gin.Context) {
	id := c.Param("id")

	payment := models.CryptoPayment{
		ID:         id,
		UserID:     "u1",
		Amount:     50.00,
		CryptoType: "btc",
		Address:    mockWallets["btc"],
		TxHash:     "0x123abc...",
		Status:     "confirmed",
		CreatedAt:  time.Now(),
	}

	c.JSON(http.StatusOK, payment)
}
