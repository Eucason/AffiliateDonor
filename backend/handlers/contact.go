package handlers

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// SubmitContactMessage accepts public contact form submissions.
func SubmitContactMessage(c *gin.Context) {
	var req struct {
		Name    string `json:"name" binding:"required"`
		Email   string `json:"email" binding:"required"`
		Subject string `json:"subject" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now().UTC()
	message := models.AdminMessage{
		ID:               "msg-" + now.Format("20060102150405"),
		SenderName:       req.Name,
		SenderEmail:      req.Email,
		Subject:          req.Subject,
		Body:             req.Message,
		Status:           "unread",
		Severity:         "normal",
		AssignedAdmin:    "Unassigned",
		ReceivedAt:       now,
		UpdatedAt:        now,
		Source:           "contact_form",
		RelatedDonations: []models.AdminMessageDonation{},
		Notes:            []models.AdminMessageNote{},
	}

	c.JSON(http.StatusCreated, message)
}
