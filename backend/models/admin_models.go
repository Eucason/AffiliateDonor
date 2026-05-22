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
