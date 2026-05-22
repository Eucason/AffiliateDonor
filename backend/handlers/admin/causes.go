package admin

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// GetAdminCauses returns admin-facing campaign records.
func GetAdminCauses(c *gin.Context) {
	causes := adminCauseFixtures()

	c.JSON(http.StatusOK, gin.H{
		"causes":  causes,
		"summary": summarizeAdminCauses(causes),
	})
}

// GetAdminCause returns one admin-facing campaign record.
func GetAdminCause(c *gin.Context) {
	id := c.Param("id")

	for _, cause := range adminCauseFixtures() {
		if cause.ID == id || cause.Slug == id {
			c.JSON(http.StatusOK, cause)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
}

// CreateAdminCause is a route shape for future campaign persistence.
func CreateAdminCause(c *gin.Context) {
	var req models.AdminCause
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	now := time.Now().UTC()
	req.ID = "cause-" + now.Format("20060102150405")
	req.CreatedAt = now
	req.UpdatedAt = now
	req.Currency = "USD"
	req.LinkedDonations = []models.AdminCauseDonation{}
	req.Activity = []models.AdminCauseActivityEvent{
		{
			ID:          req.ID + "-created",
			Label:       "Campaign created",
			Description: "Campaign was created from the admin route.",
			Actor:       "Admin Team",
			OccurredAt:  now,
		},
	}

	c.JSON(http.StatusCreated, req)
}

// UpdateAdminCause is a route shape for future campaign edits.
func UpdateAdminCause(c *gin.Context) {
	id := c.Param("id")
	var req models.AdminCause
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	req.ID = id
	req.UpdatedAt = time.Now().UTC()
	c.JSON(http.StatusOK, req)
}

// UpdateAdminCauseStatus is a lightweight publishing workflow route shape.
func UpdateAdminCauseStatus(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _, cause := range adminCauseFixtures() {
		if cause.ID == id || cause.Slug == id {
			cause.Status = req.Status
			cause.UpdatedAt = time.Now().UTC()
			c.JSON(http.StatusOK, cause)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Campaign not found"})
}

func summarizeAdminCauses(causes []models.AdminCause) models.AdminCauseSummary {
	summary := models.AdminCauseSummary{}

	for _, cause := range causes {
		if cause.Status == "active" {
			summary.ActiveCount++
		}
		if cause.Status == "draft" {
			summary.DraftCount++
		}
		if cause.Status == "archived" {
			summary.ArchivedCount++
		}

		summary.TotalRaised += cause.Raised
		summary.TotalGoal += cause.Goal
	}

	return summary
}

func adminCauseFixtures() []models.AdminCause {
	now := time.Now().UTC()

	return []models.AdminCause{
		newAdminCause("1", "Clean Water Initiative", "clean-water", "Environment", "Providing safe, reliable drinking water systems for communities with limited access.", 200000, 125000, 1234, "Global", "2026-01-15", "2026-12-31", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200", true, true, "active", "50,000+ people served with clean water access", now.Add(-4*time.Hour)),
		newAdminCause("2", "Education for All", "education-for-all", "Education", "Funding school materials, teacher support, and digital learning tools for underserved students.", 150000, 85000, 892, "East Africa", "2026-02-01", "2026-11-30", "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200", true, true, "active", "12,000 students receiving classroom support", now.Add(-18*time.Hour)),
		newAdminCause("3", "Wildlife Conservation", "wildlife-conservation", "Environment", "Protecting endangered habitats through conservation patrols and local stewardship programs.", 120000, 95000, 1567, "Kenya", "2026-01-08", "", "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200", false, true, "active", "18 protected habitat zones monitored weekly", now.Add(-30*time.Hour)),
		newAdminCause("4", "Hunger Relief", "hunger-relief", "Humanitarian", "Coordinating emergency food distribution and long-term nutrition programs.", 250000, 165000, 2341, "Global", "2026-03-05", "", "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200", false, true, "pending", "1.8M meals scheduled through partner networks", now.Add(-52*time.Hour)),
		newAdminCause("5", "Healthcare Access", "healthcare-access", "Health", "Mobile clinic funding for preventative care and maternal health outreach.", 200000, 142000, 1876, "Rural clinics", "2026-02-20", "", "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200", true, false, "draft", "32 clinic days ready for launch", now.Add(-74*time.Hour)),
		newAdminCause("6", "Climate Action", "climate-action", "Environment", "Community-led tree planting, clean energy workshops, and climate resilience training.", 100000, 78000, 945, "Pacific communities", "2025-10-01", "2026-04-15", "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200", false, true, "archived", "80,000 trees planted with local partners", now.Add(-168*time.Hour)),
	}
}

func newAdminCause(id string, name string, slug string, category string, description string, goal float64, raised float64, supporters int, location string, startDate string, endDate string, image string, featured bool, verified bool, status string, impactMetric string, updatedAt time.Time) models.AdminCause {
	createdAt := updatedAt.AddDate(0, -1, 0)

	return models.AdminCause{
		ID:             id,
		Name:           name,
		Slug:           slug,
		Category:       category,
		Description:    description,
		Goal:           goal,
		Raised:         raised,
		Currency:       "USD",
		Supporters:     supporters,
		Location:       location,
		StartDate:      startDate,
		EndDate:        endDate,
		MainImage:      image,
		GalleryImages:  []string{},
		Featured:       featured,
		Verified:       verified,
		Status:         status,
		ImpactMetric:   impactMetric,
		SEOTitle:       name + " | AffiliateDonor",
		SEODescription: description,
		CreatedAt:      createdAt,
		UpdatedAt:      updatedAt,
		LinkedDonations: []models.AdminCauseDonation{
			{
				ID:         "don-" + slug + "-1",
				DonorName:  "Maya Thompson",
				DonorEmail: "maya@example.com",
				Amount:     250,
				Currency:   "USD",
				Status:     "successful",
				CreatedAt:  updatedAt.Add(-26 * time.Hour),
			},
			{
				ID:         "don-" + slug + "-2",
				DonorName:  "Aisha Khan",
				DonorEmail: "aisha@example.com",
				Amount:     120,
				Currency:   "USD",
				Status:     "pending",
				CreatedAt:  updatedAt.Add(-52 * time.Hour),
			},
		},
		Activity: []models.AdminCauseActivityEvent{
			{
				ID:          id + "-created",
				Label:       "Campaign created",
				Description: name + " was added to the admin campaign queue.",
				Actor:       "Admin Team",
				OccurredAt:  createdAt,
			},
			{
				ID:          id + "-updated",
				Label:       "Campaign updated",
				Description: "Funding details, media, or publishing state were reviewed.",
				Actor:       "Program Lead",
				OccurredAt:  updatedAt,
			},
		},
	}
}
