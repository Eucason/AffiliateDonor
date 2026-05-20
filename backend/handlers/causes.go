package handlers

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// Mock data - in production, this would query Supabase
var mockCauses = []models.Cause{
	{
		ID:          "1",
		Name:        "Clean Water Initiative",
		Category:    "Environment",
		Description: "Providing clean drinking water to communities in need",
		Image:       "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
		Goal:        200000,
		Raised:      125000,
		Supporters:  1234,
		Location:    "Global",
		StartDate:   time.Now().AddDate(0, -3, 0),
		Verified:    true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	},
	{
		ID:          "2",
		Name:        "Education for All",
		Category:    "Education",
		Description: "Ensuring every child has access to quality education",
		Image:       "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
		Goal:        150000,
		Raised:      85000,
		Supporters:  892,
		Location:    "Africa",
		StartDate:   time.Now().AddDate(0, -6, 0),
		Verified:    true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	},
}

func GetCauses(c *gin.Context) {
	category := c.Query("category")
	
	causes := mockCauses
	if category != "" && category != "All" {
		filtered := []models.Cause{}
		for _, cause := range causes {
			if cause.Category == category {
				filtered = append(filtered, cause)
			}
		}
		causes = filtered
	}

	c.JSON(http.StatusOK, gin.H{
		"causes": causes,
		"total":  len(causes),
	})
}

func GetCause(c *gin.Context) {
	id := c.Param("id")
	
	for _, cause := range mockCauses {
		if cause.ID == id {
			c.JSON(http.StatusOK, cause)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Cause not found"})
}

func GetCauseDonations(c *gin.Context) {
	id := c.Param("id")
	
	// Mock donation data
	donations := []models.Donation{
		{
			ID:        "d1",
			UserID:    "u1",
			CauseID:   id,
			Amount:    50.00,
			Currency:  "USD",
			Method:    "card",
			Status:    "completed",
			CreatedAt: time.Now().AddDate(0, 0, -2),
		},
		{
			ID:        "d2",
			UserID:    "u2",
			CauseID:   id,
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
