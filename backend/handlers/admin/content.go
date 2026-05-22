package admin

import (
	"net/http"
	"sort"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/affiliatedonor/backend/services"
	"github.com/gin-gonic/gin"
)

var mockContentBlocks = []models.AdminContentBlock{
	createContentBlock(models.AdminContentBlock{
		ID:                "content-home-hero",
		Area:              "homepage",
		Type:              "homepage_hero",
		Title:             "Homepage Hero",
		Slug:              "homepage-hero",
		Status:            "published",
		Summary:           "Primary message for the homepage hero.",
		Body:              "Turn everyday purchases into direct support for verified causes.",
		MediaURL:          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400",
		CTALabel:          "Explore Causes",
		CTATarget:         "/causes",
		LinkedEntityID:    "clean-water",
		LinkedEntityLabel: "Clean Water Initiative",
		Metadata: models.AdminContentMetadata{
			"eyebrow":            "Shop with purpose",
			"secondaryCtaLabel":  "How it works",
			"secondaryCtaTarget": "/how-it-works",
		},
		SortOrder: 1,
		UpdatedBy: "Content Lead",
	}, 6),
	createContentBlock(models.AdminContentBlock{
		ID:                "content-home-featured",
		Area:              "homepage",
		Type:              "featured_section",
		Title:             "Featured Causes Strip",
		Slug:              "featured-causes-strip",
		Status:            "draft",
		Summary:           "Homepage section highlighting campaigns, products, and stories.",
		Body:              "Promote timely campaigns and new impact stories in a single scannable section.",
		LinkedEntityID:    "featured-campaigns",
		LinkedEntityLabel: "Campaign rotation",
		Metadata: models.AdminContentMetadata{
			"featuredItems": []string{"Clean Water Initiative", "Education for All", "Healthcare Access"},
			"layout":        "three-column",
		},
		SortOrder: 2,
		UpdatedBy: "Content Lead",
	}, 24),
	createContentBlock(models.AdminContentBlock{
		ID:         "content-banner-giving-week",
		Area:       "banners",
		Type:       "announcement",
		Title:      "Spring Giving Week",
		Slug:       "spring-giving-week",
		Status:     "scheduled",
		Summary:    "Scheduled banner for matching campaign week.",
		Body:       "All donations are matched this week for selected campaigns.",
		CTALabel:   "Donate Now",
		CTATarget:  "/causes",
		LinkLabel:  "View matched campaigns",
		LinkTarget: "/causes?featured=true",
		Metadata: models.AdminContentMetadata{
			"severity":  "info",
			"placement": "top-bar",
		},
		SortOrder: 1,
		UpdatedBy: "Campaigns",
	}, 10),
	createContentBlock(models.AdminContentBlock{
		ID:        "content-impact-water",
		Area:      "impact-stories",
		Type:      "impact_story",
		Title:     "Clean Water Access in Kisumu",
		Slug:      "clean-water-access-kisumu",
		Status:    "published",
		Summary:   "Impact story showing a completed clean water milestone.",
		Body:      "Local partners installed filtration stations that now support families, schools, and clinics with safer water access.",
		MediaURL:  "https://images.unsplash.com/photo-1541976590-713941681591?w=1200",
		SortOrder: 1,
		Metadata: models.AdminContentMetadata{
			"impactMetric": "5,000 families reached",
			"location":     "Kisumu, Kenya",
		},
		LinkedEntityID:    "clean-water",
		LinkedEntityLabel: "Clean Water Initiative",
		UpdatedBy:         "Impact Team",
	}, 18),
	createContentBlock(models.AdminContentBlock{
		ID:        "content-testimonial-donor",
		Area:      "testimonials",
		Type:      "testimonial",
		Title:     "Maya Thompson",
		Slug:      "maya-thompson",
		Status:    "published",
		Summary:   "Donor quote for homepage and impact pages.",
		Body:      "I can see where my giving goes, and the purchase-linked donations make it easy to keep supporting causes every month.",
		MediaURL:  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
		SortOrder: 1,
		Metadata: models.AdminContentMetadata{
			"role":         "Monthly donor",
			"organization": "AffiliateDonor community",
		},
		UpdatedBy: "Support",
	}, 48),
	createContentBlock(models.AdminContentBlock{
		ID:        "content-about-mission",
		Area:      "about",
		Type:      "about_section",
		Title:     "Mission Statement",
		Slug:      "mission-statement",
		Status:    "published",
		Summary:   "Core mission copy for about and mission pages.",
		Body:      "AffiliateDonor helps people turn everyday commerce into transparent support for trusted campaigns.",
		SortOrder: 1,
		Metadata: models.AdminContentMetadata{
			"sectionLabel": "Mission",
			"displayStyle": "text-with-metric",
			"metric":       "$642K contributed",
		},
		UpdatedBy: "Content Lead",
	}, 72),
	createContentBlock(models.AdminContentBlock{
		ID:         "content-footer-contact",
		Area:       "footer",
		Type:       "footer_group",
		Title:      "Footer Contact",
		Slug:       "footer-contact",
		Status:     "draft",
		Summary:    "Primary footer contact and social link group.",
		Body:       "Questions about donations, partners, or campaigns? Reach out to the support team.",
		LinkLabel:  "Contact us",
		LinkTarget: "/contact",
		SortOrder:  1,
		Metadata: models.AdminContentMetadata{
			"email":       "support@affiliatedonor.example",
			"phone":       "+1 555 0148",
			"address":     "Remote-first impact team",
			"linkGroup":   []string{"About", "Partners", "Terms", "Contact"},
			"socialLinks": []string{"Facebook", "Instagram", "LinkedIn"},
		},
		UpdatedBy: "Operations",
	}, 15),
}

// GetAdminContentBlocks returns CMS blocks with optional filters.
func GetAdminContentBlocks(c *gin.Context) {
	blocks := services.FilterAdminContent(
		mockContentBlocks,
		c.Query("area"),
		c.Query("status"),
		c.Query("type"),
		c.Query("search"),
	)

	sort.SliceStable(blocks, func(i, j int) bool {
		if blocks[i].Area == blocks[j].Area {
			return blocks[i].SortOrder < blocks[j].SortOrder
		}
		return blocks[i].Area < blocks[j].Area
	})

	c.JSON(http.StatusOK, gin.H{
		"blocks":  blocks,
		"summary": services.SummarizeAdminContent(blocks),
	})
}

// GetAdminContentBlock returns a single CMS block.
func GetAdminContentBlock(c *gin.Context) {
	id := c.Param("id")
	for _, block := range mockContentBlocks {
		if block.ID == id {
			c.JSON(http.StatusOK, block)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Content block not found"})
}

// UpdateAdminContentBlock updates editable CMS block fields.
func UpdateAdminContentBlock(c *gin.Context) {
	id := c.Param("id")
	var request models.AdminContentBlock
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for index, current := range mockContentBlocks {
		if current.ID == id {
			request.ID = id
			request.CreatedAt = current.CreatedAt
			request.UpdatedAt = time.Now()
			if request.UpdatedBy == "" {
				request.UpdatedBy = "Admin Team"
			}
			applyContentWorkflowDates(&request)
			mockContentBlocks[index] = request
			c.JSON(http.StatusOK, request)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Content block not found"})
}

// UpdateAdminContentStatus updates only the workflow status for a CMS block.
func UpdateAdminContentStatus(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for index, block := range mockContentBlocks {
		if block.ID == id {
			block.Status = request.Status
			block.UpdatedAt = time.Now()
			block.UpdatedBy = "Admin Team"
			applyContentWorkflowDates(&block)
			mockContentBlocks[index] = block
			c.JSON(http.StatusOK, block)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Content block not found"})
}

func createContentBlock(block models.AdminContentBlock, updatedHoursAgo int) models.AdminContentBlock {
	block.UpdatedAt = time.Now().Add(-time.Duration(updatedHoursAgo) * time.Hour)
	block.CreatedAt = block.UpdatedAt.Add(-96 * time.Hour)
	applyContentWorkflowDates(&block)
	return block
}

func applyContentWorkflowDates(block *models.AdminContentBlock) {
	now := block.UpdatedAt
	if now.IsZero() {
		now = time.Now()
	}

	switch block.Status {
	case "published":
		if block.PublishedAt == nil {
			block.PublishedAt = &now
		}
		block.ArchivedAt = nil
	case "scheduled":
		if block.ScheduledAt == nil {
			block.ScheduledAt = &now
		}
		block.ArchivedAt = nil
	case "archived":
		if block.ArchivedAt == nil {
			block.ArchivedAt = &now
		}
	default:
		block.PublishedAt = nil
		block.ArchivedAt = nil
	}
}
