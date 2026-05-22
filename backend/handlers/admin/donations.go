package admin

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// GetAdminDonations returns admin-facing donation records.
func GetAdminDonations(c *gin.Context) {
	donations := adminDonationFixtures()

	c.JSON(http.StatusOK, gin.H{
		"donations": donations,
		"summary":   summarizeAdminDonations(donations),
	})
}

// GetAdminDonation returns one admin-facing donation record.
func GetAdminDonation(c *gin.Context) {
	id := c.Param("id")

	for _, donation := range adminDonationFixtures() {
		if donation.ID == id {
			c.JSON(http.StatusOK, donation)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Donation not found"})
}

// MarkAdminDonationReviewed is a placeholder review action for audit-ready workflows.
func MarkAdminDonationReviewed(c *gin.Context) {
	id := c.Param("id")
	reviewedAt := time.Now().UTC()

	for _, donation := range adminDonationFixtures() {
		if donation.ID == id {
			donation.ReviewedAt = &reviewedAt
			donation.ReviewedBy = "Admin Team"
			donation.UpdatedAt = reviewedAt
			donation.Timeline = append(donation.Timeline, models.AdminDonationTimelineEvent{
				ID:          id + "-reviewed",
				Label:       "Admin review",
				Description: "Donation marked reviewed in admin.",
				Status:      "reviewed",
				OccurredAt:  reviewedAt,
			})
			c.JSON(http.StatusOK, donation)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Donation not found"})
}

func summarizeAdminDonations(donations []models.AdminDonation) models.AdminDonationSummary {
	summary := models.AdminDonationSummary{}

	for _, donation := range donations {
		if donation.Status == "successful" {
			summary.TotalContributed += donation.Amount
			summary.SuccessfulCount++
		}

		if donation.Status == "pending" {
			summary.PendingCount++
		}

		if donation.Status == "failed" || donation.Status == "refunded" {
			summary.FailedOrRefundedCount++
		}

		summary.VisibleTotal += donation.Amount
	}

	return summary
}

func adminDonationFixtures() []models.AdminDonation {
	now := time.Now().UTC()

	return []models.AdminDonation{
		newAdminDonation("don-1048", "usr-201", "Maya Thompson", "maya@example.com", "clean-water", "Clean Water Initiative", 250, "Card", "successful", "txn_card_9F41AZ", now.Add(-18*time.Minute), "Admin Team", ""),
		newAdminDonation("don-1047", "usr-202", "Daniel Cooper", "daniel@example.com", "education-for-all", "Education for All", 75, "PayPal", "successful", "txn_paypal_2ND8QP", now.Add(-54*time.Minute), "", ""),
		newAdminDonation("don-1046", "usr-203", "Aisha Khan", "aisha@example.com", "healthcare-access", "Healthcare Access", 120, "Crypto", "pending", "0x8f31c4d9bd72", now.Add(-92*time.Minute), "", "Waiting for final network confirmation."),
		newAdminDonation("don-1045", "usr-204", "Noah Rivera", "noah@example.com", "hunger-relief", "Hunger Relief", 50, "Card", "failed", "txn_card_3KQ2PL", now.Add(-140*time.Minute), "", "Card declined by issuer. Donor can retry from receipt link."),
		newAdminDonation("don-1044", "usr-205", "Olivia Grant", "olivia@example.com", "clean-water", "Clean Water Initiative", 500, "Bank Transfer", "successful", "txn_bank_7QZ44L", now.Add(-320*time.Minute), "Finance", ""),
		newAdminDonation("don-1043", "usr-206", "Liam Brooks", "liam@example.com", "wildlife-conservation", "Wildlife Conservation", 35, "Card", "refunded", "txn_card_1BB8KS", now.Add(-980*time.Minute), "Admin Team", "Refund placeholder mirrors provider support once connected."),
	}
}

func newAdminDonation(id string, donorID string, donorName string, donorEmail string, campaignID string, campaignName string, amount float64, method string, status string, transactionID string, createdAt time.Time, reviewedBy string, notes string) models.AdminDonation {
	updatedAt := createdAt.Add(12 * time.Minute)
	var reviewedAt *time.Time
	if reviewedBy != "" {
		reviewedAt = &updatedAt
	}

	return models.AdminDonation{
		ID:            id,
		DonorID:       donorID,
		DonorName:     donorName,
		DonorEmail:    donorEmail,
		CampaignID:    campaignID,
		CampaignName:  campaignName,
		Amount:        amount,
		Currency:      "USD",
		Method:        method,
		Status:        status,
		TransactionID: transactionID,
		CreatedAt:     createdAt,
		UpdatedAt:     updatedAt,
		ReviewedAt:    reviewedAt,
		ReviewedBy:    reviewedBy,
		AdminNotes:    notes,
		Timeline:      adminDonationTimeline(id, status, createdAt, updatedAt, reviewedAt),
	}
}

func adminDonationTimeline(id string, status string, createdAt time.Time, updatedAt time.Time, reviewedAt *time.Time) []models.AdminDonationTimelineEvent {
	timeline := []models.AdminDonationTimelineEvent{
		{
			ID:          id + "-created",
			Label:       "Donation created",
			Description: "Contribution record was created from checkout.",
			Status:      "pending",
			OccurredAt:  createdAt,
		},
	}

	if status != "pending" {
		label := "Payment successful"
		description := "Payment provider confirmed the transaction."
		if status == "failed" {
			label = "Payment failed"
			description = "Payment provider returned a failed status."
		}
		if status == "refunded" {
			label = "Refund recorded"
			description = "Refund has been logged for review."
		}

		timeline = append(timeline, models.AdminDonationTimelineEvent{
			ID:          id + "-" + status,
			Label:       label,
			Description: description,
			Status:      status,
			OccurredAt:  updatedAt,
		})
	}

	if reviewedAt != nil {
		timeline = append(timeline, models.AdminDonationTimelineEvent{
			ID:          id + "-reviewed",
			Label:       "Admin review",
			Description: "Donation was checked by an admin.",
			Status:      "reviewed",
			OccurredAt:  *reviewedAt,
		})
	}

	return timeline
}
