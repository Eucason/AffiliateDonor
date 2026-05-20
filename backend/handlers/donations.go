package handlers

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

func CreateDonation(c *gin.Context) {
	var req struct {
		CauseID  string  `json:"cause_id" binding:"required"`
		Amount   float64 `json:"amount" binding:"required"`
		Method   string  `json:"method" binding:"required"`
		UserID   string  `json:"user_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	donation := models.Donation{
		ID:        "don_" + time.Now().Format("20060102150405"),
		UserID:    req.UserID,
		CauseID:   req.CauseID,
		Amount:    req.Amount,
		Currency:  "USD",
		Method:    req.Method,
		Status:    "pending",
		CreatedAt: time.Now(),
	}

	// In production: Save to database
	// For now, return success
	donation.Status = "completed"

	c.JSON(http.StatusCreated, donation)
}

func GetDonations(c *gin.Context) {
	userID := c.Query("user_id")
	causeID := c.Query("cause_id")

	// Mock donations
	donations := []models.Donation{
		{
			ID:        "d1",
			UserID:    userID,
			CauseID:   causeID,
			Amount:    50.00,
			Currency:  "USD",
			Method:    "card",
			Status:    "completed",
			CreatedAt: time.Now().AddDate(0, 0, -2),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"donations": donations,
		"total":     len(donations),
	})
}

func GetDonation(c *gin.Context) {
	id := c.Param("id")

	donation := models.Donation{
		ID:        id,
		UserID:    "u1",
		CauseID:   "1",
		Amount:    50.00,
		Currency:  "USD",
		Method:    "card",
		Status:    "completed",
		CreatedAt: time.Now(),
	}

	c.JSON(http.StatusOK, donation)
}

func TrackDonation(c *gin.Context) {
	var req struct {
		DonationID string `json:"donation_id" binding:"required"`
		Event      string `json:"event" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Track donation event (analytics, real-time updates)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Donation tracked successfully",
	})
}
