package admin

import (
	"net/http"

	"github.com/affiliatedonor/backend/services"
	"github.com/gin-gonic/gin"
)

// GetAdminReports returns the complete admin reporting payload.
func GetAdminReports(c *gin.Context) {
	c.JSON(http.StatusOK, services.BuildAdminReports())
}

// GetAdminDonationReport returns donation trend and record analytics.
func GetAdminDonationReport(c *gin.Context) {
	report := services.BuildAdminReports()
	c.JSON(http.StatusOK, gin.H{
		"summary":         report.Summary,
		"donationRecords": report.DonationRecords,
		"donationTrends":  report.DonationTrends,
		"filterOptions":   report.FilterOptions,
		"generatedAt":     report.GeneratedAt,
	})
}

// GetAdminCampaignReport returns campaign performance analytics.
func GetAdminCampaignReport(c *gin.Context) {
	report := services.BuildAdminReports()
	c.JSON(http.StatusOK, gin.H{
		"summary":             report.Summary,
		"campaignPerformance": report.CampaignPerformance,
		"filterOptions":       report.FilterOptions,
		"generatedAt":         report.GeneratedAt,
	})
}

// GetAdminDonorReport returns donor growth analytics.
func GetAdminDonorReport(c *gin.Context) {
	report := services.BuildAdminReports()
	c.JSON(http.StatusOK, gin.H{
		"summary":       report.Summary,
		"donorGrowth":   report.DonorGrowth,
		"filterOptions": report.FilterOptions,
		"generatedAt":   report.GeneratedAt,
	})
}

// GetAdminContentReport returns content performance analytics.
func GetAdminContentReport(c *gin.Context) {
	report := services.BuildAdminReports()
	c.JSON(http.StatusOK, gin.H{
		"summary":            report.Summary,
		"contentPerformance": report.ContentPerformance,
		"filterOptions":      report.FilterOptions,
		"generatedAt":        report.GeneratedAt,
	})
}

// GetAdminProductReport returns product and affiliate analytics.
func GetAdminProductReport(c *gin.Context) {
	report := services.BuildAdminReports()
	c.JSON(http.StatusOK, gin.H{
		"summary":            report.Summary,
		"productPerformance": report.ProductPerformance,
		"filterOptions":      report.FilterOptions,
		"generatedAt":        report.GeneratedAt,
	})
}

// GetAdminExports returns export definitions for reports.
func GetAdminExports(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"exports": services.BuildAdminReports().Exports})
}
