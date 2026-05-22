package admin

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// GetAdminMessages returns admin-facing contact messages.
func GetAdminMessages(c *gin.Context) {
	messages := adminMessageFixtures()

	c.JSON(http.StatusOK, gin.H{
		"messages": messages,
		"summary":  summarizeAdminMessages(messages),
	})
}

// GetAdminMessage returns one contact message.
func GetAdminMessage(c *gin.Context) {
	id := c.Param("id")

	for _, message := range adminMessageFixtures() {
		if message.ID == id {
			c.JSON(http.StatusOK, message)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
}

// UpdateAdminMessageStatus is a route shape for message workflow status changes.
func UpdateAdminMessageStatus(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, message := range adminMessageFixtures() {
		if message.ID == id {
			message.Status = req.Status
			message.UpdatedAt = time.Now().UTC()
			c.JSON(http.StatusOK, message)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
}

// AssignAdminMessage is a route shape for assigning inbox work.
func AssignAdminMessage(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		AssignedAdmin string `json:"assignedAdmin" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, message := range adminMessageFixtures() {
		if message.ID == id {
			message.AssignedAdmin = req.AssignedAdmin
			message.UpdatedAt = time.Now().UTC()
			c.JSON(http.StatusOK, message)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
}

// AddAdminMessageNote is a route shape for admin notes.
func AddAdminMessageNote(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Body string `json:"body" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, message := range adminMessageFixtures() {
		if message.ID == id {
			now := time.Now().UTC()
			message.Notes = append([]models.AdminMessageNote{
				{
					ID:        id + "-note-" + now.Format("20060102150405"),
					Author:    "Admin Team",
					Body:      req.Body,
					CreatedAt: now,
				},
			}, message.Notes...)
			message.UpdatedAt = now
			c.JSON(http.StatusOK, message)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
}

func summarizeAdminMessages(messages []models.AdminMessage) models.AdminMessageSummary {
	summary := models.AdminMessageSummary{}

	for _, message := range messages {
		summary.TotalCount++
		if message.Status == "unread" {
			summary.UnreadCount++
		}
		if message.Status == "pending" {
			summary.PendingCount++
		}
		if message.Status == "replied" {
			summary.RepliedCount++
		}
		if message.Status == "resolved" {
			summary.ResolvedCount++
		}
	}

	return summary
}

func adminMessageFixtures() []models.AdminMessage {
	now := time.Now().UTC()

	return []models.AdminMessage{
		newAdminMessage("msg-308", "Olivia Grant", "olivia@example.com", "Question about monthly donations", "I would like to switch my donation to a monthly cadence and split it across Clean Water and Healthcare Access.", "unread", "priority", "Support", "contact_form", now.Add(-24*time.Minute), &models.AdminMessageDonorMatch{ID: "usr-205", Name: "Olivia Grant", Email: "olivia@example.com", TotalDonations: 900, CausesSupported: 3}),
		newAdminMessage("msg-307", "Impact Partners Co.", "partners@example.com", "Partnership proposal", "Our CSR team would like to sponsor a matching campaign during our annual giving week.", "pending", "urgent", "Partnerships", "partner_form", now.Add(-180*time.Minute), nil),
		newAdminMessage("msg-306", "Liam Brooks", "liam@example.com", "Merch order support", "I ordered a shirt and want to confirm whether the contribution still goes to Wildlife Conservation after a refund request.", "resolved", "normal", "Support", "contact_form", now.Add(-540*time.Minute), &models.AdminMessageDonorMatch{ID: "usr-206", Name: "Liam Brooks", Email: "liam@example.com", TotalDonations: 35, CausesSupported: 1}),
		newAdminMessage("msg-305", "Priya Shah", "priya@example.com", "Receipt request", "Could you resend the receipt for my Education for All contribution? I need it for company matching.", "replied", "normal", "Finance", "contact_form", now.Add(-870*time.Minute), &models.AdminMessageDonorMatch{ID: "usr-207", Name: "Priya Shah", Email: "priya@example.com", TotalDonations: 180, CausesSupported: 1}),
	}
}

func newAdminMessage(id string, senderName string, senderEmail string, subject string, body string, status string, severity string, assignedAdmin string, source string, receivedAt time.Time, donorMatch *models.AdminMessageDonorMatch) models.AdminMessage {
	updatedAt := receivedAt.Add(30 * time.Minute)
	relatedDonations := []models.AdminMessageDonation{}
	if donorMatch != nil {
		relatedDonations = append(relatedDonations, models.AdminMessageDonation{
			ID:           "don-" + donorMatch.ID + "-1",
			CampaignName: "Clean Water Initiative",
			Amount:       donorMatch.TotalDonations,
			Currency:     "USD",
			Status:       "successful",
			CreatedAt:    receivedAt.Add(-4 * time.Hour),
		})
	}

	return models.AdminMessage{
		ID:               id,
		SenderName:       senderName,
		SenderEmail:      senderEmail,
		Subject:          subject,
		Body:             body,
		Status:           status,
		Severity:         severity,
		AssignedAdmin:    assignedAdmin,
		ReceivedAt:       receivedAt,
		UpdatedAt:        updatedAt,
		Source:           source,
		DonorMatch:       donorMatch,
		RelatedDonations: relatedDonations,
		Notes: []models.AdminMessageNote{
			{
				ID:        id + "-note-1",
				Author:    "Admin Team",
				Body:      "Ready for triage.",
				CreatedAt: updatedAt,
			},
		},
	}
}
