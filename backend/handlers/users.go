package handlers

import (
	"net/http"

	"github.com/affiliatedonor/backend/services"
	"github.com/gin-gonic/gin"
)

func GetCurrentUser(c *gin.Context) {
	// Get user ID from auth context
	_, exists := c.Get("auth_token")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "missing authentication",
		})
		return
	}

	// Get user context - for now we'll use a placeholder
	// In production, decode the JWT token to get user_id
	userID := c.GetString("user_id")
	userEmail := c.GetString("user_email")

	// If no user_id from token claims, return error
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid or expired token",
		})
		return
	}

	// Get or create user profile from Supabase
	profile, err := services.GetOrCreateUserProfile(c.Request.Context(), userID, userEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to retrieve user profile",
		})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func GetUserDonations(c *gin.Context) {
	// Get user ID from auth context
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "missing user identification",
		})
		return
	}

	// TODO: Query donations from Supabase
	// For now, return empty list
	c.JSON(http.StatusOK, gin.H{
		"donations": []interface{}{},
		"total":     0,
	})
}

func GetUserImpact(c *gin.Context) {
	// Get user ID from auth context
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "missing user identification",
		})
		return
	}

	// Get user profile to retrieve impact data
	profile, err := services.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "user not found",
		})
		return
	}

	impact := gin.H{
		"total_donated":    profile.TotalDonations,
		"causes_supported": profile.CausesSupported,
		"impact_score":     profile.ImpactScore,
		"total_purchases":  profile.TotalPurchases,
		"supported_causes": []interface{}{},
	}

	c.JSON(http.StatusOK, impact)
}

func UpdateUser(c *gin.Context) {
	// Get user ID from auth context
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "missing user identification",
		})
		return
	}

	var req struct {
		Name         string `json:"name"`
		ProfileImage string `json:"profile_image"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get existing profile
	profile, err := services.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "user not found",
		})
		return
	}

	// Update fields
	if req.Name != "" {
		profile.Name = req.Name
	}
	if req.ProfileImage != "" {
		profile.ProfileImage = req.ProfileImage
	}

	// Save to Supabase
	err = services.UpdateUserProfile(c.Request.Context(), profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update user profile",
		})
		return
	}

	c.JSON(http.StatusOK, profile)
}
