package admin

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// GetAdminUsers returns admin-facing user and donor records.
func GetAdminUsers(c *gin.Context) {
	users := adminUserFixtures()

	c.JSON(http.StatusOK, gin.H{
		"users":   users,
		"summary": summarizeAdminUsers(users),
	})
}

// GetAdminUser returns one admin-facing user profile.
func GetAdminUser(c *gin.Context) {
	id := c.Param("id")

	for _, user := range adminUserFixtures() {
		if user.ID == id {
			c.JSON(http.StatusOK, user)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

// UpdateAdminUserRole is a route shape for role assignment workflows.
func UpdateAdminUserRole(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Role string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, user := range adminUserFixtures() {
		if user.ID == id {
			user.Role = req.Role
			user.Activity = append([]models.AdminUserActivity{
				{
					ID:          id + "-role-" + time.Now().UTC().Format("20060102150405"),
					Type:        "role",
					Label:       "Role updated",
					Description: "Role changed to " + req.Role + ".",
					CreatedAt:   time.Now().UTC(),
				},
			}, user.Activity...)
			c.JSON(http.StatusOK, user)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

// AddAdminUserNote is a route shape for profile notes.
func AddAdminUserNote(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Body string `json:"body" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, user := range adminUserFixtures() {
		if user.ID == id {
			user.Notes = append([]models.AdminUserNote{
				{
					ID:        id + "-note-" + time.Now().UTC().Format("20060102150405"),
					Author:    "Admin Team",
					Body:      req.Body,
					CreatedAt: time.Now().UTC(),
				},
			}, user.Notes...)
			c.JSON(http.StatusOK, user)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
}

func summarizeAdminUsers(users []models.AdminUser) models.AdminUserSummary {
	summary := models.AdminUserSummary{}

	for _, user := range users {
		summary.TotalUsers++
		if user.TotalDonations > 0 {
			summary.DonorCount++
		}
		if user.Role != "donor" {
			summary.AdminCount++
		}
		if user.Status == "inactive" {
			summary.InactiveCount++
		}
		summary.TotalDonations += user.TotalDonations
	}

	return summary
}

func adminUserFixtures() []models.AdminUser {
	now := time.Now().UTC()

	return []models.AdminUser{
		newAdminUser("usr-201", "Maya Thompson", "maya@example.com", "donor", "active", []string{"Clean Water Initiative", "Education for All"}, []models.AdminUserDonation{
			adminUserDonation("don-1048", "clean-water", "Clean Water Initiative", 250, "Card", "successful", "txn_card_9F41AZ", now.Add(-18*time.Hour)),
			adminUserDonation("don-1032", "education-for-all", "Education for All", 125, "PayPal", "successful", "txn_paypal_73QAZ", now.Add(-2600*time.Hour)),
		}, 3, now.AddDate(0, 0, -420), now.Add(-3*time.Hour), "Austin, TX"),
		newAdminUser("usr-202", "Daniel Cooper", "daniel@example.com", "support", "active", []string{"Education for All"}, []models.AdminUserDonation{
			adminUserDonation("don-1047", "education-for-all", "Education for All", 75, "PayPal", "successful", "txn_paypal_2ND8QP", now.Add(-54*time.Hour)),
		}, 1, now.AddDate(0, 0, -280), now.Add(-11*time.Hour), "Denver, CO"),
		newAdminUser("usr-203", "Aisha Khan", "aisha@example.com", "donor", "active", []string{"Healthcare Access", "Clean Water Initiative"}, []models.AdminUserDonation{
			adminUserDonation("don-1046", "healthcare-access", "Healthcare Access", 120, "Crypto", "pending", "0x8f31c4d9bd72", now.Add(-92*time.Hour)),
			adminUserDonation("don-1020", "clean-water", "Clean Water Initiative", 60, "Card", "successful", "txn_card_82MNZ", now.Add(-6200*time.Hour)),
		}, 0, now.AddDate(0, 0, -190), now.Add(-20*time.Hour), "Brooklyn, NY"),
		newAdminUser("usr-204", "Noah Rivera", "noah@example.com", "donor", "inactive", []string{"Hunger Relief"}, []models.AdminUserDonation{
			adminUserDonation("don-1045", "hunger-relief", "Hunger Relief", 50, "Card", "failed", "txn_card_3KQ2PL", now.Add(-140*time.Hour)),
		}, 2, now.AddDate(0, 0, -510), now.Add(-980*time.Hour), "Phoenix, AZ"),
		newAdminUser("usr-205", "Olivia Grant", "olivia@example.com", "admin", "active", []string{"Clean Water Initiative", "Wildlife Conservation", "Healthcare Access"}, []models.AdminUserDonation{
			adminUserDonation("don-1044", "clean-water", "Clean Water Initiative", 500, "Bank Transfer", "successful", "txn_bank_7QZ44L", now.Add(-320*time.Hour)),
			adminUserDonation("don-1011", "wildlife-conservation", "Wildlife Conservation", 220, "Card", "successful", "txn_card_91KQW", now.Add(-12600*time.Hour)),
		}, 7, now.AddDate(0, 0, -650), now.Add(-1*time.Hour), "Seattle, WA"),
	}
}

func newAdminUser(id string, name string, email string, role string, status string, supportedCauses []string, donations []models.AdminUserDonation, purchases int, joinedAt time.Time, lastActiveAt time.Time, location string) models.AdminUser {
	totalDonations := 0.0
	for _, donation := range donations {
		if donation.Status == "successful" {
			totalDonations += donation.Amount
		}
	}

	activity := []models.AdminUserActivity{
		{
			ID:          id + "-profile",
			Type:        "profile",
			Label:       "Profile activity",
			Description: "User was recently active on the platform.",
			CreatedAt:   lastActiveAt,
		},
	}
	for _, donation := range donations {
		activity = append(activity, models.AdminUserActivity{
			ID:          donation.ID + "-activity",
			Type:        "donation",
			Label:       "Donation updated",
			Description: donation.CampaignName + " - " + donation.Status,
			CreatedAt:   donation.CreatedAt,
			SourcePath:  "/admin/donations/" + donation.ID,
		})
	}

	return models.AdminUser{
		ID:                id,
		Name:              name,
		Email:             email,
		Location:          location,
		Role:              role,
		Status:            status,
		JoinedAt:          joinedAt,
		LastActiveAt:      lastActiveAt,
		TotalDonations:    totalDonations,
		TotalPurchases:    purchases,
		CausesSupported:   len(supportedCauses),
		ImpactScore:       int(totalDonations/5) + len(supportedCauses)*80 + purchases*20,
		SupportedCauses:   supportedCauses,
		ContactMessageIDs: []string{},
		DonationHistory:   donations,
		ProductActivity:   []models.AdminUserProductActivity{},
		Activity:          activity,
		Notes: []models.AdminUserNote{
			{
				ID:        id + "-note-1",
				Author:    "Admin Team",
				Body:      "Profile ready for donor support review.",
				CreatedAt: time.Now().UTC().AddDate(0, 0, -7),
			},
		},
	}
}

func adminUserDonation(id string, campaignID string, campaignName string, amount float64, method string, status string, transactionID string, createdAt time.Time) models.AdminUserDonation {
	return models.AdminUserDonation{
		ID:            id,
		CampaignID:    campaignID,
		CampaignName:  campaignName,
		Amount:        amount,
		Currency:      "USD",
		Method:        method,
		Status:        status,
		TransactionID: transactionID,
		CreatedAt:     createdAt,
	}
}
