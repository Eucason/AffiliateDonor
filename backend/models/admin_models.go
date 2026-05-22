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

// AdminUserDonation is a donor-facing contribution record for user profiles.
type AdminUserDonation struct {
	ID            string    `json:"id"`
	CampaignID    string    `json:"campaignId"`
	CampaignName  string    `json:"campaignName"`
	Amount        float64   `json:"amount"`
	Currency      string    `json:"currency"`
	Method        string    `json:"method"`
	Status        string    `json:"status"`
	TransactionID string    `json:"transactionId"`
	CreatedAt     time.Time `json:"createdAt"`
}

// AdminUserActivity is a compact donor/admin profile activity event.
type AdminUserActivity struct {
	ID          string    `json:"id"`
	Type        string    `json:"type"`
	Label       string    `json:"label"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	SourcePath  string    `json:"sourcePath,omitempty"`
}

// AdminUserNote is an internal admin note attached to a user profile.
type AdminUserNote struct {
	ID        string    `json:"id"`
	Author    string    `json:"author"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"createdAt"`
}

// AdminUserProductActivity captures affiliate or merchandise engagement.
type AdminUserProductActivity struct {
	ID        string    `json:"id"`
	Label     string    `json:"label"`
	Type      string    `json:"type"`
	Value     float64   `json:"value"`
	CreatedAt time.Time `json:"createdAt"`
}

// AdminUser is the admin-facing user and donor management model.
type AdminUser struct {
	ID                string                     `json:"id"`
	Name              string                     `json:"name"`
	Email             string                     `json:"email"`
	AvatarURL         string                     `json:"avatarUrl,omitempty"`
	Phone             string                     `json:"phone,omitempty"`
	Location          string                     `json:"location,omitempty"`
	Role              string                     `json:"role"`
	Status            string                     `json:"status"`
	JoinedAt          time.Time                  `json:"joinedAt"`
	LastActiveAt      time.Time                  `json:"lastActiveAt"`
	TotalDonations    float64                    `json:"totalDonations"`
	TotalPurchases    int                        `json:"totalPurchases"`
	CausesSupported   int                        `json:"causesSupported"`
	ImpactScore       int                        `json:"impactScore"`
	SupportedCauses   []string                   `json:"supportedCauses"`
	ContactMessageIDs []string                   `json:"contactMessageIds"`
	DonationHistory   []AdminUserDonation        `json:"donationHistory"`
	ProductActivity   []AdminUserProductActivity `json:"productActivity"`
	Activity          []AdminUserActivity        `json:"activity"`
	Notes             []AdminUserNote            `json:"notes"`
}

// AdminUserSummary provides list page rollups.
type AdminUserSummary struct {
	TotalUsers     int     `json:"totalUsers"`
	DonorCount     int     `json:"donorCount"`
	AdminCount     int     `json:"adminCount"`
	InactiveCount  int     `json:"inactiveCount"`
	TotalDonations float64 `json:"totalDonations"`
}

// AdminMessageNote is an internal note attached to a contact message.
type AdminMessageNote struct {
	ID        string    `json:"id"`
	Author    string    `json:"author"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"createdAt"`
}

// AdminMessageDonorMatch is the donor profile matched by sender email.
type AdminMessageDonorMatch struct {
	ID              string  `json:"id"`
	Name            string  `json:"name"`
	Email           string  `json:"email"`
	TotalDonations  float64 `json:"totalDonations"`
	CausesSupported int     `json:"causesSupported"`
}

// AdminMessageDonation is a compact donation reference linked to a message.
type AdminMessageDonation struct {
	ID           string    `json:"id"`
	CampaignName string    `json:"campaignName"`
	Amount       float64   `json:"amount"`
	Currency     string    `json:"currency"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"createdAt"`
}

// AdminMessage is the admin-facing contact inbox record.
type AdminMessage struct {
	ID               string                  `json:"id"`
	SenderName       string                  `json:"senderName"`
	SenderEmail      string                  `json:"senderEmail"`
	Subject          string                  `json:"subject"`
	Body             string                  `json:"body"`
	Status           string                  `json:"status"`
	Severity         string                  `json:"severity"`
	AssignedAdmin    string                  `json:"assignedAdmin"`
	ReceivedAt       time.Time               `json:"receivedAt"`
	UpdatedAt        time.Time               `json:"updatedAt"`
	Source           string                  `json:"source"`
	DonorMatch       *AdminMessageDonorMatch `json:"donorMatch,omitempty"`
	RelatedDonations []AdminMessageDonation  `json:"relatedDonations"`
	Notes            []AdminMessageNote      `json:"notes"`
}

// AdminMessageSummary provides inbox status rollups.
type AdminMessageSummary struct {
	UnreadCount   int `json:"unreadCount"`
	PendingCount  int `json:"pendingCount"`
	RepliedCount  int `json:"repliedCount"`
	ResolvedCount int `json:"resolvedCount"`
	TotalCount    int `json:"totalCount"`
}

// AdminContentMetadata stores flexible per-block CMS settings.
type AdminContentMetadata map[string]interface{}

// AdminContentBlock is a structured public website content block.
type AdminContentBlock struct {
	ID                string               `json:"id"`
	Area              string               `json:"area"`
	Type              string               `json:"type"`
	Title             string               `json:"title"`
	Slug              string               `json:"slug"`
	Status            string               `json:"status"`
	Summary           string               `json:"summary"`
	Body              string               `json:"body"`
	MediaURL          string               `json:"mediaUrl,omitempty"`
	CTALabel          string               `json:"ctaLabel,omitempty"`
	CTATarget         string               `json:"ctaTarget,omitempty"`
	LinkLabel         string               `json:"linkLabel,omitempty"`
	LinkTarget        string               `json:"linkTarget,omitempty"`
	LinkedEntityID    string               `json:"linkedEntityId,omitempty"`
	LinkedEntityLabel string               `json:"linkedEntityLabel,omitempty"`
	Metadata          AdminContentMetadata `json:"metadata"`
	SortOrder         int                  `json:"sortOrder"`
	StartAt           *time.Time           `json:"startAt,omitempty"`
	EndAt             *time.Time           `json:"endAt,omitempty"`
	ScheduledAt       *time.Time           `json:"scheduledAt,omitempty"`
	PublishedAt       *time.Time           `json:"publishedAt,omitempty"`
	ArchivedAt        *time.Time           `json:"archivedAt,omitempty"`
	UpdatedBy         string               `json:"updatedBy"`
	CreatedAt         time.Time            `json:"createdAt"`
	UpdatedAt         time.Time            `json:"updatedAt"`
}

// AdminContentSummary provides status rollups for CMS pages.
type AdminContentSummary struct {
	TotalCount        int `json:"totalCount"`
	PublishedCount    int `json:"publishedCount"`
	DraftCount        int `json:"draftCount"`
	ScheduledCount    int `json:"scheduledCount"`
	ArchivedCount     int `json:"archivedCount"`
	MissingMediaCount int `json:"missingMediaCount"`
}
