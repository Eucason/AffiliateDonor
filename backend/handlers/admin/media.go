package admin

import (
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

var mockMediaAssets = []models.AdminMediaAsset{
	createMediaAsset(models.AdminMediaAsset{
		ID:           "media-clean-water-hero",
		Title:        "Clean Water Campaign Hero",
		FileName:     "clean-water-hero.jpg",
		URL:          "https://images.unsplash.com/photo-1541976590-713941681591?w=1400",
		ThumbnailURL: "https://images.unsplash.com/photo-1541976590-713941681591?w=600",
		MimeType:     "image/jpeg",
		Type:         "image",
		SizeBytes:    845000,
		Width:        1400,
		Height:       934,
		AltText:      "Community members gathering near a clean water project.",
		Caption:      "Clean Water Initiative field update image.",
		Tags:         []string{"clean-water", "campaign", "hero"},
		UploadedBy:   "Content Lead",
		Usage: []models.AdminMediaUsage{
			{
				ID:         "usage-clean-water-cause",
				Area:       "causes",
				EntityType: "campaign",
				EntityID:   "clean-water",
				Label:      "Clean Water Initiative",
				Path:       "/admin/causes/clean-water",
			},
			{
				ID:         "usage-impact-story",
				Area:       "content",
				EntityType: "impact_story",
				EntityID:   "content-impact-water",
				Label:      "Clean Water Access in Kisumu",
				Path:       "/admin/content/impact-stories",
			},
		},
	}, 8),
	createMediaAsset(models.AdminMediaAsset{
		ID:           "media-home-hero",
		Title:        "Homepage Giving Hero",
		FileName:     "homepage-giving-hero.jpg",
		URL:          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400",
		ThumbnailURL: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600",
		MimeType:     "image/jpeg",
		Type:         "image",
		SizeBytes:    1024000,
		Width:        1400,
		Height:       933,
		AltText:      "Volunteers carrying donation boxes during an impact campaign.",
		Caption:      "Hero image for public homepage messaging.",
		Tags:         []string{"homepage", "volunteers", "hero"},
		UploadedBy:   "Design",
		Usage: []models.AdminMediaUsage{
			{
				ID:         "usage-home-hero",
				Area:       "content",
				EntityType: "homepage_hero",
				EntityID:   "content-home-hero",
				Label:      "Homepage Hero",
				Path:       "/admin/content/homepage",
			},
		},
	}, 20),
	createMediaAsset(models.AdminMediaAsset{
		ID:           "media-product-bottle",
		Title:        "Eco Bottle Product Image",
		FileName:     "eco-bottle-product.jpg",
		URL:          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1000",
		ThumbnailURL: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
		MimeType:     "image/jpeg",
		Type:         "image",
		SizeBytes:    548000,
		Width:        1000,
		Height:       1250,
		AltText:      "",
		Caption:      "Affiliate product image awaiting accessibility metadata.",
		Tags:         []string{"product", "affiliate", "bottle"},
		UploadedBy:   "Commerce",
		Usage: []models.AdminMediaUsage{
			{
				ID:         "usage-product-bottle",
				Area:       "products",
				EntityType: "affiliate_product",
				EntityID:   "p1",
				Label:      "Eco-Friendly Water Bottle",
				Path:       "/admin/products/affiliate",
			},
		},
	}, 96),
	createMediaAsset(models.AdminMediaAsset{
		ID:           "media-brand-logo",
		Title:        "AffiliateDonor Logo Mark",
		FileName:     "affiliatedonor-logo.svg",
		URL:          "https://dummyimage.com/512x512/2563eb/ffffff&text=AD",
		ThumbnailURL: "https://dummyimage.com/512x512/2563eb/ffffff&text=AD",
		MimeType:     "image/svg+xml",
		Type:         "svg",
		SizeBytes:    24000,
		Width:        512,
		Height:       512,
		AltText:      "AffiliateDonor AD logo mark.",
		Caption:      "Primary square logo mark.",
		Tags:         []string{"brand", "logo"},
		UploadedBy:   "Design",
		Usage: []models.AdminMediaUsage{
			{
				ID:         "usage-settings-brand",
				Area:       "settings",
				EntityType: "branding",
				EntityID:   "settings-branding",
				Label:      "Branding settings",
				Path:       "/admin/settings",
			},
		},
	}, 86),
	createMediaAsset(models.AdminMediaAsset{
		ID:           "media-unused-partner",
		Title:        "Partner Review Draft Image",
		FileName:     "partner-review-draft.jpg",
		URL:          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200",
		ThumbnailURL: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600",
		MimeType:     "image/jpeg",
		Type:         "image",
		SizeBytes:    664000,
		Width:        1200,
		Height:       800,
		AltText:      "",
		Caption:      "Unused partner article draft image.",
		Tags:         []string{"partners", "draft"},
		UploadedBy:   "Editorial",
		Usage:        []models.AdminMediaUsage{},
	}, 128),
}

// GetAdminMediaAssets returns media assets with optional query filters.
func GetAdminMediaAssets(c *gin.Context) {
	assets := filterMediaAssets(
		mockMediaAssets,
		c.Query("type"),
		c.Query("usageArea"),
		c.Query("uploadedBy"),
		c.Query("search"),
	)

	sort.SliceStable(assets, func(i, j int) bool {
		return assets[i].UpdatedAt.After(assets[j].UpdatedAt)
	})

	c.JSON(http.StatusOK, gin.H{
		"assets":  assets,
		"summary": summarizeMediaAssets(assets),
	})
}

// GetAdminMediaAsset returns a single media asset.
func GetAdminMediaAsset(c *gin.Context) {
	id := c.Param("id")
	for _, asset := range mockMediaAssets {
		if asset.ID == id {
			c.JSON(http.StatusOK, asset)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Media asset not found"})
}

// CreateAdminMediaAsset creates an admin media asset placeholder record.
func CreateAdminMediaAsset(c *gin.Context) {
	var request models.AdminMediaAsset
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if request.Title == "" || request.FileName == "" || request.URL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title, file name, and URL are required"})
		return
	}

	now := time.Now()
	request.ID = "media-" + now.Format("20060102150405")
	request.UploadedAt = now
	request.UpdatedAt = now
	request.ThumbnailURL = request.URL
	request.Usage = []models.AdminMediaUsage{}
	request.Status = "active"
	if request.UploadedBy == "" {
		request.UploadedBy = "Admin Team"
	}
	mockMediaAssets = append(mockMediaAssets, request)
	c.JSON(http.StatusCreated, request)
}

// UpdateAdminMediaAsset updates admin media metadata.
func UpdateAdminMediaAsset(c *gin.Context) {
	id := c.Param("id")
	var request models.AdminMediaAsset
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for index, current := range mockMediaAssets {
		if current.ID == id {
			request.ID = id
			request.UploadedAt = current.UploadedAt
			request.UpdatedAt = time.Now()
			if request.Usage == nil {
				request.Usage = current.Usage
			}
			if request.Status == "" {
				request.Status = current.Status
			}
			mockMediaAssets[index] = request
			c.JSON(http.StatusOK, request)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Media asset not found"})
}

// DeleteAdminMediaAsset deletes an asset from the mock media library.
func DeleteAdminMediaAsset(c *gin.Context) {
	id := c.Param("id")
	for index, asset := range mockMediaAssets {
		if asset.ID == id {
			mockMediaAssets = append(mockMediaAssets[:index], mockMediaAssets[index+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "Media asset deleted"})
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "Media asset not found"})
}

func createMediaAsset(asset models.AdminMediaAsset, uploadedHoursAgo int) models.AdminMediaAsset {
	asset.UploadedAt = time.Now().Add(-time.Duration(uploadedHoursAgo) * time.Hour)
	asset.UpdatedAt = asset.UploadedAt.Add(4 * time.Hour)
	asset.Status = "active"
	return asset
}

func filterMediaAssets(assets []models.AdminMediaAsset, assetType string, usageArea string, uploadedBy string, search string) []models.AdminMediaAsset {
	filtered := make([]models.AdminMediaAsset, 0, len(assets))
	normalizedSearch := strings.ToLower(strings.TrimSpace(search))

	for _, asset := range assets {
		if assetType != "" && assetType != "all" && asset.Type != assetType {
			continue
		}
		if usageArea != "" && usageArea != "all" && !assetMatchesUsageArea(asset, usageArea) {
			continue
		}
		if uploadedBy != "" && asset.UploadedBy != uploadedBy {
			continue
		}
		if normalizedSearch != "" && !mediaAssetMatchesSearch(asset, normalizedSearch) {
			continue
		}
		filtered = append(filtered, asset)
	}
	return filtered
}

func assetMatchesUsageArea(asset models.AdminMediaAsset, usageArea string) bool {
	if usageArea == "unused" {
		return len(asset.Usage) == 0
	}
	for _, usage := range asset.Usage {
		if usage.Area == usageArea {
			return true
		}
	}
	return false
}

func mediaAssetMatchesSearch(asset models.AdminMediaAsset, search string) bool {
	searchable := strings.ToLower(strings.Join([]string{
		asset.Title,
		asset.FileName,
		asset.URL,
		asset.AltText,
		asset.Caption,
		asset.UploadedBy,
		strings.Join(asset.Tags, " "),
		mediaUsageText(asset.Usage),
	}, " "))
	return strings.Contains(searchable, search)
}

func mediaUsageText(usages []models.AdminMediaUsage) string {
	parts := make([]string, 0, len(usages))
	for _, usage := range usages {
		parts = append(parts, usage.Area, usage.Label, usage.EntityType)
	}
	return strings.Join(parts, " ")
}

func summarizeMediaAssets(assets []models.AdminMediaAsset) models.AdminMediaSummary {
	summary := models.AdminMediaSummary{}
	for _, asset := range assets {
		summary.TotalCount++
		if asset.Type == "image" || asset.Type == "svg" {
			summary.ImageCount++
			if strings.TrimSpace(asset.AltText) == "" {
				summary.MissingAltCount++
			}
		}
		if len(asset.Usage) == 0 {
			summary.UnusedCount++
		} else {
			summary.UsedCount++
		}
		summary.StorageBytes += asset.SizeBytes
	}
	return summary
}
