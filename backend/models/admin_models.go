package models

import "time"

// AdminDonationTimelineEvent describes a payment or review event for admin detail views.
type AdminDonationTimelineEvent struct {
	ID          string    `json:"id"`
	Label       string    `json:"label"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	OccurredAt  time.Time `json:"occurredAt"`
}

// AdminDonation is the admin-facing contribution record.
type AdminDonation struct {
	ID            string                       `json:"id"`
	DonorID       string                       `json:"donorId"`
	DonorName     string                       `json:"donorName"`
	DonorEmail    string                       `json:"donorEmail"`
	CampaignID    string                       `json:"campaignId"`
	CampaignName  string                       `json:"campaignName"`
	Amount        float64                      `json:"amount"`
	Currency      string                       `json:"currency"`
	Method        string                       `json:"method"`
	Status        string                       `json:"status"`
	TransactionID string                       `json:"transactionId"`
	CreatedAt     time.Time                    `json:"createdAt"`
	UpdatedAt     time.Time                    `json:"updatedAt"`
	ReviewedAt    *time.Time                   `json:"reviewedAt,omitempty"`
	ReviewedBy    string                       `json:"reviewedBy,omitempty"`
	AdminNotes    string                       `json:"adminNotes,omitempty"`
	Timeline      []AdminDonationTimelineEvent `json:"timeline"`
}

// AdminDonationSummary provides donation status rollups for the admin list page.
type AdminDonationSummary struct {
	TotalContributed      float64 `json:"totalContributed"`
	SuccessfulCount       int     `json:"successfulCount"`
	PendingCount          int     `json:"pendingCount"`
	FailedOrRefundedCount int     `json:"failedOrRefundedCount"`
	VisibleTotal          float64 `json:"visibleTotal"`
}

// AdminCauseDonation is a compact donation record linked to a campaign.
type AdminCauseDonation struct {
	ID         string    `json:"id"`
	DonorName  string    `json:"donorName"`
	DonorEmail string    `json:"donorEmail"`
	Amount     float64   `json:"amount"`
	Currency   string    `json:"currency"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"createdAt"`
}

// AdminCauseActivityEvent is a compact activity timeline entry for campaigns.
type AdminCauseActivityEvent struct {
	ID          string    `json:"id"`
	Label       string    `json:"label"`
	Description string    `json:"description"`
	OccurredAt  time.Time `json:"occurredAt"`
	Actor       string    `json:"actor"`
}

// AdminCause is the admin-facing campaign management model.
type AdminCause struct {
	ID              string                    `json:"id"`
	Name            string                    `json:"name"`
	Slug            string                    `json:"slug"`
	Category        string                    `json:"category"`
	Description     string                    `json:"description"`
	Goal            float64                   `json:"goal"`
	Raised          float64                   `json:"raised"`
	Currency        string                    `json:"currency"`
	Supporters      int                       `json:"supporters"`
	Location        string                    `json:"location"`
	StartDate       string                    `json:"startDate"`
	EndDate         string                    `json:"endDate,omitempty"`
	MainImage       string                    `json:"mainImage"`
	GalleryImages   []string                  `json:"galleryImages"`
	Featured        bool                      `json:"featured"`
	Verified        bool                      `json:"verified"`
	Status          string                    `json:"status"`
	ImpactMetric    string                    `json:"impactMetric"`
	SEOTitle        string                    `json:"seoTitle,omitempty"`
	SEODescription  string                    `json:"seoDescription,omitempty"`
	CreatedAt       time.Time                 `json:"createdAt"`
	UpdatedAt       time.Time                 `json:"updatedAt"`
	LinkedDonations []AdminCauseDonation      `json:"linkedDonations"`
	Activity        []AdminCauseActivityEvent `json:"activity"`
}

// AdminCauseSummary provides campaign status and funding rollups.
type AdminCauseSummary struct {
	ActiveCount   int     `json:"activeCount"`
	DraftCount    int     `json:"draftCount"`
	ArchivedCount int     `json:"archivedCount"`
	TotalRaised   float64 `json:"totalRaised"`
	TotalGoal     float64 `json:"totalGoal"`
}
