package services

import (
	"strings"

	"github.com/affiliatedonor/backend/models"
)

// SummarizeAdminContent returns status rollups for CMS blocks.
func SummarizeAdminContent(blocks []models.AdminContentBlock) models.AdminContentSummary {
	summary := models.AdminContentSummary{}
	for _, block := range blocks {
		summary.TotalCount++
		switch block.Status {
		case "published":
			summary.PublishedCount++
		case "draft":
			summary.DraftCount++
		case "scheduled":
			summary.ScheduledCount++
		case "archived":
			summary.ArchivedCount++
		}
		if contentBlockNeedsMedia(block.Type) && block.MediaURL == "" {
			summary.MissingMediaCount++
		}
	}
	return summary
}

// FilterAdminContent filters blocks by common admin query parameters.
func FilterAdminContent(blocks []models.AdminContentBlock, area string, status string, blockType string, search string) []models.AdminContentBlock {
	filtered := make([]models.AdminContentBlock, 0, len(blocks))
	normalizedSearch := strings.ToLower(strings.TrimSpace(search))

	for _, block := range blocks {
		if area != "" && block.Area != area {
			continue
		}
		if status != "" && status != "all" && block.Status != status {
			continue
		}
		if blockType != "" && blockType != "all" && block.Type != blockType {
			continue
		}
		if normalizedSearch != "" && !contentBlockMatchesSearch(block, normalizedSearch) {
			continue
		}
		filtered = append(filtered, block)
	}

	return filtered
}

func contentBlockMatchesSearch(block models.AdminContentBlock, search string) bool {
	searchable := strings.ToLower(strings.Join([]string{
		block.Title,
		block.Slug,
		block.Area,
		block.Type,
		block.Status,
		block.Summary,
		block.Body,
		block.LinkedEntityLabel,
	}, " "))
	return strings.Contains(searchable, search)
}

func contentBlockNeedsMedia(blockType string) bool {
	return blockType == "homepage_hero" || blockType == "banner" || blockType == "impact_story" || blockType == "testimonial"
}
