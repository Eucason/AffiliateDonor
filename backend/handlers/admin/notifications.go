package admin

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// GetAdminNotifications returns admin alert records and preference settings.
func GetAdminNotifications(c *gin.Context) {
	notifications := adminNotificationFixtures()

	c.JSON(http.StatusOK, gin.H{
		"notifications": notifications,
		"preferences":   adminNotificationPreferences(),
		"summary":       summarizeAdminNotifications(notifications),
	})
}

// UpdateAdminNotificationStatus updates a notification read state.
func UpdateAdminNotificationStatus(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, notification := range adminNotificationFixtures() {
		if notification.ID == id {
			notification.Status = req.Status
			if req.Status == "read" {
				now := time.Now().UTC()
				notification.ReadAt = &now
			} else {
				notification.ReadAt = nil
			}
			c.JSON(http.StatusOK, notification)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Notification not found"})
}

// MarkAllAdminNotificationsRead marks active notifications read.
func MarkAllAdminNotificationsRead(c *gin.Context) {
	readAt := time.Now().UTC()
	notifications := adminNotificationFixtures()

	for index := range notifications {
		if notifications[index].Status != "archived" {
			notifications[index].Status = "read"
			notifications[index].ReadAt = &readAt
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"notifications": notifications,
		"preferences":   adminNotificationPreferences(),
		"summary":       summarizeAdminNotifications(notifications),
	})
}

func adminNotificationFixtures() []models.AdminNotification {
	now := time.Now().UTC()
	readAt := now.Add(-8 * time.Hour)

	return []models.AdminNotification{
		adminNotification("ntf-501", "payment", "Stripe webhook retry needed", "A failed payment event has not reconciled after three delivery attempts.", "unread", "critical", "Donation don-1045", "/admin/donations/don-1045", now.Add(-1*time.Hour), nil),
		adminNotification("ntf-502", "campaign", "Campaign ready for approval", "Hunger Relief updated its goal, hero image, and verification notes.", "unread", "warning", "Hunger Relief", "/admin/approvals", now.Add(-4*time.Hour), nil),
		adminNotification("ntf-503", "message", "New partner message", "A corporate partner asked about matched giving opportunities.", "read", "info", "Contact message msg-308", "/admin/messages/msg-308", now.Add(-8*time.Hour), &readAt),
		adminNotification("ntf-504", "product", "Low merch inventory", "Impact Hoodie medium inventory is below the configured threshold.", "unread", "warning", "Impact Hoodie", "/admin/products/merch", now.Add(-18*time.Hour), nil),
		adminNotification("ntf-505", "donation", "Large donation received", "A $500 donation was completed for Clean Water Initiative.", "read", "success", "Donation don-1044", "/admin/donations/don-1044", now.Add(-24*time.Hour), &readAt),
		adminNotification("ntf-506", "content", "Scheduled banner needs review", "Spring Giving Week is scheduled but missing final approval.", "archived", "info", "Spring Giving Week", "/admin/content/banners", now.Add(-72*time.Hour), nil),
	}
}

func adminNotification(id string, notificationType string, title string, summary string, status string, severity string, sourceLabel string, sourcePath string, createdAt time.Time, readAt *time.Time) models.AdminNotification {
	return models.AdminNotification{
		ID:          id,
		Type:        notificationType,
		Title:       title,
		Summary:     summary,
		Status:      status,
		Severity:    severity,
		SourceLabel: sourceLabel,
		SourcePath:  sourcePath,
		CreatedAt:   createdAt,
		ReadAt:      readAt,
	}
}

func summarizeAdminNotifications(notifications []models.AdminNotification) models.AdminNotificationSummary {
	summary := models.AdminNotificationSummary{}

	for _, notification := range notifications {
		summary.TotalCount++
		if notification.Status == "unread" {
			summary.UnreadCount++
		}
		if notification.Severity == "critical" {
			summary.CriticalCount++
		}
		if notification.Status == "archived" {
			summary.ArchivedCount++
		}
	}

	return summary
}
