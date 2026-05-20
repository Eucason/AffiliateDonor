package handlers

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

func GetCurrentUser(c *gin.Context) {
	// In production: Get user from JWT token
	user := models.User{
		ID:              "u1",
		Email:           "user@example.com",
		Name:            "John Doe",
		TotalDonations:  450.75,
		TotalPurchases:  12,
		CausesSupported: 5,
		ImpactScore:     892,
		CreatedAt:       time.Now().AddDate(0, -6, 0),
		UpdatedAt:       time.Now(),
	}

	c.JSON(http.StatusOK, user)
}

func GetUserDonations(c *gin.Context) {
	// Mock user donations
	donations := []models.Donation{
		{
			ID:        "d1",
			UserID:    "u1",
			CauseID:   "1",
			Amount:    50.00,
			Currency:  "USD",
			Method:    "card",
			Status:    "completed",
			CreatedAt: time.Now().AddDate(0, 0, -2),
		},
		{
			ID:        "d2",
			UserID:    "u1",
			CauseID:   "2",
			Amount:    100.00,
			Currency:  "USD",
			Method:    "paypal",
			Status:    "completed",
			CreatedAt: time.Now().AddDate(0, 0, -5),
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"donations": donations,
		"total":     len(donations),
	})
}

func GetUserImpact(c *gin.Context) {
	impact := gin.H{
		"total_donated":      450.75,
		"causes_supported":   5,
		"people_helped":      45,
		"impact_rank":        "top_10_percent",
		"monthly_average":    75.12,
		"yearly_projection":  901.44,
		"supported_causes": []gin.H{
			{
				"cause_id":   "1",
				"cause_name": "Clean Water Initiative",
				"donated":    150.00,
				"progress":   75,
			},
			{
				"cause_id":   "2",
				"cause_name": "Education for All",
				"donated":    125.00,
				"progress":   62,
			},
		},
	}

	c.JSON(http.StatusOK, impact)
}

func UpdateUser(c *gin.Context) {
	var req struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production: Update in database
	user := models.User{
		ID:              "u1",
		Email:           req.Email,
		Name:            req.Name,
		TotalDonations:  450.75,
		TotalPurchases:  12,
		CausesSupported: 5,
		ImpactScore:     892,
		UpdatedAt:       time.Now(),
	}

	c.JSON(http.StatusOK, user)
}
