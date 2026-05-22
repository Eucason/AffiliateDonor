package admin

import (
	"net/http"
	"strings"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// GetAdminAuditLogs returns admin action history.
func GetAdminAuditLogs(c *gin.Context) {
	logs := adminAuditLogFixtures()

	c.JSON(http.StatusOK, gin.H{
		"logs":    logs,
		"summary": summarizeAdminAuditLogs(logs),
	})
}

func adminAuditLogFixtures() []models.AdminAuditLog {
	now := time.Now().UTC()

	return []models.AdminAuditLog{
		adminAuditLog("aud-701", "Olivia Grant", "admin", "approved_campaign", "campaign", "Clean Water Initiative", "cause-001", "Approved updated campaign media and goal copy.", "info", now.Add(-2*time.Hour)),
		adminAuditLog("aud-702", "Liam Brooks", "analyst", "exported_report", "settings", "Monthly donation export", "export-monthly", "Generated monthly donation summary export.", "info", now.Add(-6*time.Hour)),
		adminAuditLog("aud-703", "Olivia Grant", "admin", "updated_payment_settings", "settings", "Payment Settings", "settings-payments", "Changed minimum donation and public payment visibility.", "warning", now.Add(-18*time.Hour)),
		adminAuditLog("aud-704", "Grace Miller", "editor", "scheduled_content", "content", "Spring Giving Week", "content-banner-giving-week", "Scheduled homepage banner for campaign launch.", "info", now.Add(-28*time.Hour)),
		adminAuditLog("aud-705", "Noah Rivera", "support", "updated_donation_note", "donation", "Donation don-1045", "don-1045", "Added payment review note after failed card event.", "critical", now.Add(-42*time.Hour)),
		adminAuditLog("aud-706", "Olivia Grant", "admin", "rejected_product", "approval", "Solar Power Bank affiliate listing", "apv-804", "Rejected product approval request pending disclosure copy.", "warning", now.Add(-72*time.Hour)),
	}
}

func adminAuditLog(id string, actor string, actorRole string, action string, entityType string, entityLabel string, entityID string, description string, severity string, timestamp time.Time) models.AdminAuditLog {
	return models.AdminAuditLog{
		ID:          id,
		Actor:       actor,
		ActorRole:   actorRole,
		Action:      action,
		EntityType:  entityType,
		EntityLabel: entityLabel,
		EntityID:    entityID,
		Timestamp:   timestamp,
		IPAddress:   "192.0.2.42",
		Device:      "Chrome on Windows",
		Severity:    severity,
		Before: map[string]interface{}{
			"status": "pending",
			"note":   "Previous state snapshot placeholder",
		},
		After: map[string]interface{}{
			"status": "updated",
			"note":   description,
		},
		Metadata: map[string]string{
			"requestId":   id + "-request",
			"source":      "admin-panel",
			"description": description,
		},
	}
}

func summarizeAdminAuditLogs(logs []models.AdminAuditLog) models.AdminAuditSummary {
	summary := models.AdminAuditSummary{}

	for _, log := range logs {
		summary.TotalCount++
		if log.Severity == "critical" {
			summary.CriticalCount++
		}
		if log.EntityType == "settings" {
			summary.SettingsChangeCount++
		}
		if log.EntityType == "approval" || strings.Contains(log.Action, "approved") || strings.Contains(log.Action, "rejected") {
			summary.ApprovalActionCount++
		}
	}

	return summary
}
