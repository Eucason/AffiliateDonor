package services

import (
	"fmt"
	"sort"
	"time"

	"github.com/affiliatedonor/backend/models"
)

// BuildAdminReports builds safe fallback analytics for admin report routes.
func BuildAdminReports() models.AdminReportsResponse {
	now := time.Now().UTC()
	donationRecords := []models.AdminDonationReportRecord{
		newDonationReportRecord("don-1048", "Clean Water Initiative", "successful", "Card", 250, now.Add(-18*time.Minute)),
		newDonationReportRecord("don-1047", "Education for All", "successful", "PayPal", 75, now.Add(-54*time.Minute)),
		newDonationReportRecord("don-1046", "Healthcare Access", "pending", "Crypto", 120, now.Add(-92*time.Minute)),
		newDonationReportRecord("don-1045", "Hunger Relief", "failed", "Card", 50, now.Add(-140*time.Minute)),
		newDonationReportRecord("don-1044", "Clean Water Initiative", "successful", "Bank Transfer", 500, now.Add(-320*time.Minute)),
		newDonationReportRecord("don-1043", "Wildlife Conservation", "refunded", "Card", 35, now.Add(-980*time.Minute)),
		newDonationReportRecord("don-1042", "Education for All", "successful", "Card", 180, now.Add(-1260*time.Minute)),
		newDonationReportRecord("don-1041", "Healthcare Access", "pending", "PayPal", 95, now.Add(-1680*time.Minute)),
	}
	campaigns := adminCampaignPerformanceFixtures(now)
	donorGrowth := adminDonorGrowthFixtures(now)
	content := adminContentPerformanceFixtures(now)
	products := adminProductPerformanceFixtures(now)
	trends := buildDonationTrendGroups(donationRecords)
	summary := summarizeAdminReports(trends["daily"], campaigns, donorGrowth, content, products)

	return models.AdminReportsResponse{
		GeneratedAt:         now,
		Summary:             summary,
		DonationRecords:     donationRecords,
		DonationTrends:      trends,
		CampaignPerformance: campaigns,
		DonorGrowth:         donorGrowth,
		ContentPerformance:  content,
		ProductPerformance:  products,
		Exports:             BuildAdminReportExports(summary, trends["daily"], campaigns, donorGrowth, content, products),
		FilterOptions: models.AdminReportFilterOptions{
			Campaigns:        uniqueStrings(append(campaignNames(campaigns), productCauseNames(products)...)),
			DonationStatuses: uniqueStrings(donationStatuses(donationRecords)),
			PaymentMethods:   uniqueStrings(paymentMethods(donationRecords)),
			ProductTypes:     []string{"affiliate", "merch"},
			ContentTypes:     uniqueStrings(contentTypes(content)),
		},
	}
}

// BuildAdminReportExports returns CSV export definitions for the reports surface.
func BuildAdminReportExports(
	summary models.AdminReportSummary,
	donations []models.AdminDonationTrendPoint,
	campaigns []models.AdminCampaignPerformanceReport,
	donors []models.AdminDonorGrowthPoint,
	content []models.AdminContentPerformanceReport,
	products []models.AdminProductPerformanceReport,
) []models.AdminReportExportItem {
	now := time.Now().UTC()

	return []models.AdminReportExportItem{
		newExportItem("export-weekly-summary", "Weekly Summary", "overview", fmt.Sprintf("%d donations and %d product conversions.", summary.DonationCount, summary.ProductConversions), 1, now),
		newExportItem("export-monthly-summary", "Monthly Summary", "overview", fmt.Sprintf("%d active campaigns with %d%% combined progress.", summary.ActiveCampaignCount, summary.CampaignProgressPercent), 1, now),
		newExportItem("export-donations", "Donation Trends", "donations", "Date range donation totals, statuses, and amounts.", len(donations), now),
		newExportItem("export-campaigns", "Campaign Performance", "campaigns", "Campaign progress, donors, and average donation rows.", len(campaigns), now),
		newExportItem("export-donors", "Donor Growth", "donors", "New donor and returning donor trend rows.", len(donors), now),
		newExportItem("export-content", "Content Performance", "content", "Blog and CMS content performance rows.", len(content), now),
		newExportItem("export-products", "Product Performance", "products", "Affiliate and merch performance rows.", len(products), now),
	}
}

func newDonationReportRecord(id string, campaignName string, status string, method string, amount float64, createdAt time.Time) models.AdminDonationReportRecord {
	return models.AdminDonationReportRecord{
		ID:           id,
		CampaignName: campaignName,
		Status:       status,
		Method:       method,
		Amount:       amount,
		Currency:     "USD",
		CreatedAt:    createdAt,
	}
}

func buildDonationTrendGroups(records []models.AdminDonationReportRecord) map[string][]models.AdminDonationTrendPoint {
	return map[string][]models.AdminDonationTrendPoint{
		"daily":   buildDonationTrend(records, "daily"),
		"weekly":  buildDonationTrend(records, "weekly"),
		"monthly": buildDonationTrend(records, "monthly"),
	}
}

func buildDonationTrend(records []models.AdminDonationReportRecord, granularity string) []models.AdminDonationTrendPoint {
	groups := map[string]models.AdminDonationTrendPoint{}

	for _, record := range records {
		groupDate := groupDate(record.CreatedAt, granularity)
		key := groupDate.Format("2006-01-02")
		point := groups[key]
		if point.ID == "" {
			point = models.AdminDonationTrendPoint{
				ID:    granularity + "-" + key,
				Label: trendLabel(groupDate, granularity),
				Date:  key,
			}
		}

		point.DonationCount++
		if record.Status == "successful" {
			point.SuccessfulCount++
			point.Amount += record.Amount
		}
		if record.Status == "pending" {
			point.PendingCount++
		}
		if record.Status == "failed" || record.Status == "refunded" {
			point.FailedOrRefundedCount++
		}

		groups[key] = point
	}

	points := make([]models.AdminDonationTrendPoint, 0, len(groups))
	for _, point := range groups {
		points = append(points, point)
	}
	sort.SliceStable(points, func(i, j int) bool {
		return points[i].Date < points[j].Date
	})

	return points
}

func adminCampaignPerformanceFixtures(now time.Time) []models.AdminCampaignPerformanceReport {
	return []models.AdminCampaignPerformanceReport{
		newCampaignReport("1", "Clean Water Initiative", "Environment", "active", 125000, 200000, 1234, 250, 62, 75, now.Add(-4*time.Hour)),
		newCampaignReport("2", "Education for All", "Education", "active", 85000, 150000, 892, 127, 57, 68, now.Add(-18*time.Hour)),
		newCampaignReport("3", "Wildlife Conservation", "Environment", "active", 95000, 120000, 1567, 220, 79, 79, now.Add(-30*time.Hour)),
		newCampaignReport("4", "Hunger Relief", "Humanitarian", "pending", 165000, 250000, 2341, 50, 66, 84, now.Add(-52*time.Hour)),
		newCampaignReport("5", "Healthcare Access", "Health", "draft", 142000, 200000, 1876, 138, 71, 82, now.Add(-74*time.Hour)),
	}
}

func newCampaignReport(id string, name string, category string, status string, raised float64, goal float64, donors int, averageDonation float64, progress int, conversion int, updatedAt time.Time) models.AdminCampaignPerformanceReport {
	return models.AdminCampaignPerformanceReport{
		ID:              id,
		Name:            name,
		Category:        category,
		Status:          status,
		Raised:          raised,
		Goal:            goal,
		Currency:        "USD",
		DonorCount:      donors,
		AverageDonation: averageDonation,
		ProgressPercent: progress,
		ConversionRate:  conversion,
		UpdatedAt:       updatedAt,
		Path:            "/admin/causes/" + id,
	}
}

func adminDonorGrowthFixtures(now time.Time) []models.AdminDonorGrowthPoint {
	return []models.AdminDonorGrowthPoint{
		newDonorGrowthPoint("donor-2025-08", "Aug 2025", now.AddDate(0, -9, 0), 1, 1, 1, 250),
		newDonorGrowthPoint("donor-2025-12", "Dec 2025", now.AddDate(0, -5, 0), 2, 2, 3, 185),
		newDonorGrowthPoint("donor-2026-01", "Jan 2026", now.AddDate(0, -4, 0), 2, 2, 5, 172),
		newDonorGrowthPoint("donor-2026-02", "Feb 2026", now.AddDate(0, -3, 0), 1, 1, 6, 120),
		newDonorGrowthPoint("donor-2026-04", "Apr 2026", now.AddDate(0, -1, 0), 2, 1, 8, 138),
	}
}

func newDonorGrowthPoint(id string, label string, date time.Time, newDonors int, returningDonors int, totalDonors int, averageDonation float64) models.AdminDonorGrowthPoint {
	return models.AdminDonorGrowthPoint{
		ID:              id,
		Label:           label,
		Date:            time.Date(date.Year(), date.Month(), 1, 0, 0, 0, 0, time.UTC).Format("2006-01-02"),
		NewDonors:       newDonors,
		ReturningDonors: returningDonors,
		TotalDonors:     totalDonors,
		AverageDonation: averageDonation,
	}
}

func adminContentPerformanceFixtures(now time.Time) []models.AdminContentPerformanceReport {
	return []models.AdminContentPerformanceReport{
		newContentReport("blog-101", "10 Ways to Make Your Shopping More Impactful", "blog_post", "published", 18420, 13262, 221, now.AddDate(0, 0, -9), "/admin/blogs/edit/blog-101"),
		newContentReport("blog-102", "How We Verify Our Charitable Partners", "blog_post", "published", 12780, 9202, 153, now.AddDate(0, 0, -18), "/admin/blogs/edit/blog-102"),
		newContentReport("content-home-hero", "Homepage Hero", "homepage_hero", "published", 4120, 2802, 74, now.Add(-6*time.Hour), "/admin/content/homepage"),
		newContentReport("content-banner-giving-week", "Spring Giving Week", "announcement", "scheduled", 0, 0, 0, now.Add(-10*time.Hour), "/admin/content/banners"),
		newContentReport("content-impact-water", "Clean Water Access in Kisumu", "impact_story", "published", 3050, 2074, 55, now.Add(-18*time.Hour), "/admin/content/impact-stories"),
	}
}

func newContentReport(id string, title string, contentType string, status string, views int, visitors int, assists int, updatedAt time.Time, path string) models.AdminContentPerformanceReport {
	return models.AdminContentPerformanceReport{
		ID:                id,
		Title:             title,
		Type:              contentType,
		Status:            status,
		Views:             views,
		UniqueVisitors:    visitors,
		ConversionAssists: assists,
		UpdatedAt:         updatedAt,
		Path:              path,
	}
}

func adminProductPerformanceFixtures(now time.Time) []models.AdminProductPerformanceReport {
	return []models.AdminProductPerformanceReport{
		newProductReport("p1", "Eco-Friendly Water Bottle", "affiliate", "published", "Clean Water Initiative", 1324, 86, 2140, now.Add(-5*time.Hour)),
		newProductReport("p2", "Solar Power Bank", "affiliate", "published", "Climate Action", 788, 44, 1630, now.Add(-28*time.Hour)),
		newProductReport("merch-1", "AffiliateDonor T-Shirt", "merch", "published", "Education for All", 942, 117, 2925, now.Add(-9*time.Hour)),
		newProductReport("merch-2", "Impact Hoodie", "merch", "published", "Hunger Relief", 391, 26, 530, now.Add(-16*time.Hour)),
	}
}

func newProductReport(id string, name string, productType string, status string, cause string, clicks int, conversions int, contribution float64, updatedAt time.Time) models.AdminProductPerformanceReport {
	conversionRate := 0.0
	if clicks > 0 {
		conversionRate = float64(int((float64(conversions)/float64(clicks))*1000)) / 10
	}

	return models.AdminProductPerformanceReport{
		ID:                    id,
		Name:                  name,
		Type:                  productType,
		Status:                status,
		LinkedCauseName:       cause,
		Clicks:                clicks,
		Conversions:           conversions,
		ConversionRate:        conversionRate,
		EstimatedContribution: contribution,
		UpdatedAt:             updatedAt,
		Path:                  "/admin/products/" + id + "/edit",
	}
}

func summarizeAdminReports(
	donations []models.AdminDonationTrendPoint,
	campaigns []models.AdminCampaignPerformanceReport,
	donors []models.AdminDonorGrowthPoint,
	content []models.AdminContentPerformanceReport,
	products []models.AdminProductPerformanceReport,
) models.AdminReportSummary {
	summary := models.AdminReportSummary{}
	totalGoal := 0.0
	totalRaised := 0.0

	for _, point := range donations {
		summary.DonationTotal += point.Amount
		summary.DonationCount += point.DonationCount
		summary.SuccessfulDonationCount += point.SuccessfulCount
	}
	if summary.DonationCount > 0 {
		summary.AverageDonation = summary.DonationTotal / float64(summary.DonationCount)
	}

	for _, campaign := range campaigns {
		if campaign.Status == "active" {
			summary.ActiveCampaignCount++
		}
		totalRaised += campaign.Raised
		totalGoal += campaign.Goal
	}
	if totalGoal > 0 {
		summary.CampaignProgressPercent = int((totalRaised / totalGoal) * 100)
	}

	for _, point := range donors {
		summary.NewDonorCount += point.NewDonors
		summary.ReturningDonorCount += point.ReturningDonors
		if point.TotalDonors > summary.DonorCount {
			summary.DonorCount = point.TotalDonors
		}
	}

	for _, item := range content {
		summary.ContentUpdateCount++
		if item.Status == "published" {
			summary.PublishedContentCount++
		}
	}

	for _, product := range products {
		summary.ProductClicks += product.Clicks
		summary.ProductConversions += product.Conversions
		summary.ProductContribution += product.EstimatedContribution
	}

	return summary
}

func newExportItem(id string, label string, section string, description string, rowCount int, updatedAt time.Time) models.AdminReportExportItem {
	return models.AdminReportExportItem{
		ID:          id,
		Label:       label,
		Section:     section,
		Description: description,
		RowCount:    rowCount,
		Format:      "csv",
		UpdatedAt:   updatedAt,
	}
}

func groupDate(value time.Time, granularity string) time.Time {
	switch granularity {
	case "monthly":
		return time.Date(value.Year(), value.Month(), 1, 0, 0, 0, 0, time.UTC)
	case "weekly":
		weekday := int(value.Weekday())
		offset := 1 - weekday
		if weekday == 0 {
			offset = -6
		}
		weekStart := value.AddDate(0, 0, offset)
		return time.Date(weekStart.Year(), weekStart.Month(), weekStart.Day(), 0, 0, 0, 0, time.UTC)
	default:
		return time.Date(value.Year(), value.Month(), value.Day(), 0, 0, 0, 0, time.UTC)
	}
}

func trendLabel(value time.Time, granularity string) string {
	switch granularity {
	case "monthly":
		return value.Format("Jan 2006")
	case "weekly":
		return "Week of " + value.Format("Jan 2")
	default:
		return value.Format("Jan 2")
	}
}

func campaignNames(campaigns []models.AdminCampaignPerformanceReport) []string {
	values := make([]string, 0, len(campaigns))
	for _, campaign := range campaigns {
		values = append(values, campaign.Name)
	}
	return values
}

func productCauseNames(products []models.AdminProductPerformanceReport) []string {
	values := make([]string, 0, len(products))
	for _, product := range products {
		values = append(values, product.LinkedCauseName)
	}
	return values
}

func donationStatuses(records []models.AdminDonationReportRecord) []string {
	values := make([]string, 0, len(records))
	for _, record := range records {
		values = append(values, record.Status)
	}
	return values
}

func paymentMethods(records []models.AdminDonationReportRecord) []string {
	values := make([]string, 0, len(records))
	for _, record := range records {
		values = append(values, record.Method)
	}
	return values
}

func contentTypes(content []models.AdminContentPerformanceReport) []string {
	values := make([]string, 0, len(content))
	for _, item := range content {
		values = append(values, item.Type)
	}
	return values
}

func uniqueStrings(values []string) []string {
	seen := map[string]bool{}
	unique := []string{}
	for _, value := range values {
		if value == "" || seen[value] {
			continue
		}
		seen[value] = true
		unique = append(unique, value)
	}
	sort.Strings(unique)
	return unique
}
