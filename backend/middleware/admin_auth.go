package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AdminPermissionMiddleware is a lightweight role/permission guard for admin route shapes.
func AdminPermissionMiddleware(requiredPermission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		permissionsHeader := c.GetHeader("X-Admin-Permissions")
		if permissionsHeader == "" {
			c.Next()
			return
		}

		for _, permission := range strings.Split(permissionsHeader, ",") {
			permission = strings.TrimSpace(permission)
			if permission == requiredPermission || permission == "admin:*" {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error": "Forbidden: missing admin permission",
		})
	}
}

// CurrentAdminActor returns a display name used by fixture handlers and audit records.
func CurrentAdminActor(c *gin.Context) string {
	if actor := c.GetHeader("X-Admin-Actor"); actor != "" {
		return actor
	}

	if email, exists := c.Get("user_email"); exists {
		if emailString, ok := email.(string); ok && emailString != "" {
			return emailString
		}
	}

	return "Admin Team"
}
