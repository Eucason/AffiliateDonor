package admin

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// GetAdminApprovals returns campaign, content, product, and refund approval requests.
func GetAdminApprovals(c *gin.Context) {
	approvals := adminApprovalFixtures()

	c.JSON(http.StatusOK, gin.H{
		"approvals": approvals,
		"summary":   summarizeAdminApprovals(approvals),
	})
}

// ReviewAdminApproval approves or rejects one approval request.
func ReviewAdminApproval(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Status  string `json:"status" binding:"required"`
		Comment string `json:"comment"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, approval := range adminApprovalFixtures() {
		if approval.ID == id {
			reviewedAt := time.Now().UTC()
			approval.Status = req.Status
			approval.Reviewer = "Admin Team"
			approval.ReviewedAt = &reviewedAt
			if req.Comment == "" {
				req.Comment = "Reviewed from admin approvals."
			}
			approval.Comments = append([]models.AdminApprovalComment{
				{
					ID:        id + "-review-" + reviewedAt.Format("20060102150405"),
					Author:    "Admin Team",
					Body:      req.Comment,
					CreatedAt: reviewedAt,
				},
			}, approval.Comments...)
			c.JSON(http.StatusOK, approval)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Approval request not found"})
}

func adminApprovalFixtures() []models.AdminApprovalRequest {
	now := time.Now().UTC()

	return []models.AdminApprovalRequest{
		adminApproval("apv-801", "campaign", "pending", "urgent", "Hunger Relief campaign refresh", "Goal, media, and distribution partner copy are ready for final review.", "Daniel Cooper", "cause-004", "Hunger Relief", "/admin/causes/4", "Publishes updated campaign content and moves the campaign back into featured rotation.", now.Add(-3*time.Hour), "", nil),
		adminApproval("apv-802", "content", "pending", "high", "Spring Giving Week banner", "Homepage banner is scheduled and needs approval before the launch window.", "Grace Miller", "content-banner-giving-week", "Spring Giving Week", "/admin/content/banners", "Shows the banner to public visitors during the giving week campaign.", now.Add(-10*time.Hour), "", nil),
		adminApproval("apv-803", "product", "pending", "normal", "Impact Hoodie inventory update", "New hoodie variants and low-stock thresholds were added for merch sales.", "Olivia Grant", "merch-2", "Impact Hoodie", "/admin/products/merch", "Updates public merch availability and inventory warnings.", now.Add(-21*time.Hour), "", nil),
		adminApproval("apv-804", "product", "rejected", "normal", "Solar Power Bank affiliate listing", "Affiliate disclosure copy was incomplete for the product detail page.", "Liam Brooks", "p2", "Solar Power Bank", "/admin/products/p2/edit", "Would publish a new affiliate product to the shop experience.", now.Add(-72*time.Hour), "Olivia Grant", timePtr(now.Add(-68*time.Hour))),
		adminApproval("apv-805", "refund", "approved", "high", "Donation refund review", "Card processor refund was approved after donor support confirmation.", "Noah Rivera", "don-1043", "Donation don-1043", "/admin/donations/don-1043", "Records a refunded donation and updates reporting totals.", now.Add(-96*time.Hour), "Olivia Grant", timePtr(now.Add(-92*time.Hour))),
	}
}

func adminApproval(id string, approvalType string, status string, priority string, title string, summary string, requestedBy string, relatedEntityID string, relatedEntityLabel string, relatedEntityPath string, impact string, submittedAt time.Time, reviewer string, reviewedAt *time.Time) models.AdminApprovalRequest {
	return models.AdminApprovalRequest{
		ID:                 id,
		Type:               approvalType,
		Status:             status,
		Priority:           priority,
		Title:              title,
		Summary:            summary,
		RequestedBy:        requestedBy,
		SubmittedAt:        submittedAt,
		RelatedEntityID:    relatedEntityID,
		RelatedEntityLabel: relatedEntityLabel,
		RelatedEntityPath:  relatedEntityPath,
		Impact:             impact,
		Reviewer:           reviewer,
		ReviewedAt:         reviewedAt,
		Comments: []models.AdminApprovalComment{
			{
				ID:        id + "-comment-1",
				Author:    requestedBy,
				Body:      summary,
				CreatedAt: submittedAt,
			},
		},
	}
}

func timePtr(value time.Time) *time.Time {
	return &value
}

func summarizeAdminApprovals(approvals []models.AdminApprovalRequest) models.AdminApprovalSummary {
	summary := models.AdminApprovalSummary{}

	for _, approval := range approvals {
		summary.TotalCount++
		if approval.Status == "pending" {
			summary.PendingCount++
		}
		if approval.Status == "approved" {
			summary.ApprovedCount++
		}
		if approval.Status == "rejected" {
			summary.RejectedCount++
		}
		if approval.Priority == "urgent" {
			summary.UrgentCount++
		}
	}

	return summary
}
