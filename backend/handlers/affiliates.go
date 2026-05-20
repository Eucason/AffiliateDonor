package handlers

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

func TrackClick(c *gin.Context) {
	var req struct {
		UserID    string `json:"user_id"`
		ProductID string `json:"product_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	click := models.AffiliateClick{
		ID:        "click_" + time.Now().Format("20060102150405"),
		UserID:    req.UserID,
		ProductID: req.ProductID,
		ClickedAt: time.Now(),
		Converted: false,
		IPAddress: c.ClientIP(),
	}

	// In production: Store in database for analytics
	c.JSON(http.StatusOK, gin.H{
		"click_id": click.ID,
		"tracked":  true,
	})
}

func TrackConversion(c *gin.Context) {
	var req struct {
		ClickID      string  `json:"click_id" binding:"required"`
		OrderValue   float64 `json:"order_value" binding:"required"`
		Commission   float64 `json:"commission" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update click to converted
	// Calculate donation amount
	donationAmount := req.Commission * 0.5 // 50% of commission

	c.JSON(http.StatusOK, gin.H{
		"converted":       true,
		"donation_amount": donationAmount,
		"commission":      req.Commission,
	})
}

func GetAffiliateStats(c *gin.Context) {
	userID := c.Query("user_id")

	stats := gin.H{
		"user_id":       userID,
		"total_clicks":  156,
		"conversions":   23,
		"total_earned":  450.75,
		"total_donated": 225.38,
		"period":        "all_time",
	}

	c.JSON(http.StatusOK, stats)
}
