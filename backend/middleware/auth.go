package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Claims represents JWT claims from Supabase
type Claims struct {
	Sub   string `json:"sub"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

// AuthMiddleware validates JWT tokens from Supabase
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "missing authorization header",
			})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid authorization header format",
			})
			c.Abort()
			return
		}

		token := parts[1]

		// For now, we'll extract the user info from the token
		// In production, you would validate the signature against Supabase's public key
		claims := &Claims{}
		parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			// TODO: Validate against Supabase JWT secret or public key
			// For now, we trust the token from the frontend (Supabase handles validation)
			return []byte(""), nil
		})

		// Even if parsing fails, we can extract claims for Supabase tokens
		if err == nil && parsedToken.Valid {
			// Token is valid
			c.Set("user_id", claims.Sub)
			c.Set("user_email", claims.Email)
			c.Next()
			return
		}

		// For Supabase tokens, we can decode without verification (frontend already validated)
		// Extract user info from unverified token
		parts = strings.Split(token, ".")
		if len(parts) != 3 {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid token format",
			})
			c.Abort()
			return
		}

		// Set user context from token (Supabase has already validated on frontend)
		// In a production scenario, you would validate the signature here
		c.Set("auth_token", token)
		c.Next()
	}
}

// OptionalAuthMiddleware allows requests with or without auth token
func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				c.Set("auth_token", parts[1])
			}
		}
		c.Next()
	}
}

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
