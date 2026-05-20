package middleware

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// SimpleAdminAuthMiddleware is a basic admin authentication middleware
// In a production environment, you would use proper JWT or session-based authentication
func SimpleAdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// For development purposes, check for a simple admin token
		// In production, you would validate a proper authentication token

		// Check for admin token in header
		adminToken := c.GetHeader("X-Admin-Token")
		expectedToken := os.Getenv("ADMIN_AUTH_TOKEN")

		// If no token is set in environment, allow access (for development)
		if expectedToken == "" {
			c.Next()
			return
		}

		// If token is set, validate it
		if adminToken != expectedToken {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized: Invalid admin token",
			})
			return
		}

		c.Next()
	}
}
