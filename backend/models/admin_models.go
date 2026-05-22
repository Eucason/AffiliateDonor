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

// AdminMediaUsage records where a media asset is used in admin-managed content.
type AdminMediaUsage struct {
	ID         string `json:"id"`
	Area       string `json:"area"`
	EntityType string `json:"entityType"`
	EntityID   string `json:"entityId"`
	Label      string `json:"label"`
	Path       string `json:"path"`
}

// AdminMediaAsset is a reusable image or document in the admin media library.
type AdminMediaAsset struct {
	ID           string            `json:"id"`
	Title        string            `json:"title"`
	FileName     string            `json:"fileName"`
	URL          string            `json:"url"`
	ThumbnailURL string            `json:"thumbnailUrl,omitempty"`
	MimeType     string            `json:"mimeType"`
	Type         string            `json:"type"`
	SizeBytes    int               `json:"sizeBytes"`
	Width        int               `json:"width,omitempty"`
	Height       int               `json:"height,omitempty"`
	AltText      string            `json:"altText"`
	Caption      string            `json:"caption"`
	Tags         []string          `json:"tags"`
	UploadedBy   string            `json:"uploadedBy"`
	UploadedAt   time.Time         `json:"uploadedAt"`
	UpdatedAt    time.Time         `json:"updatedAt"`
	Usage        []AdminMediaUsage `json:"usage"`
	Status       string            `json:"status"`
}

// AdminMediaSummary provides media library rollups.
type AdminMediaSummary struct {
	TotalCount      int `json:"totalCount"`
	ImageCount      int `json:"imageCount"`
	UsedCount       int `json:"usedCount"`
	UnusedCount     int `json:"unusedCount"`
	MissingAltCount int `json:"missingAltCount"`
	StorageBytes    int `json:"storageBytes"`
}

// AdminProductVariant captures merch option inventory.
type AdminProductVariant struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	SKU               string  `json:"sku"`
	InventoryQuantity int     `json:"inventoryQuantity"`
	Price             float64 `json:"price,omitempty"`
}

// AdminProductConversion captures product tracking windows for reports.
type AdminProductConversion struct {
	ID                    string    `json:"id"`
	ProductID             string    `json:"productId"`
	Source                string    `json:"source"`
	Label                 string    `json:"label"`
	Clicks                int       `json:"clicks"`
	Conversions           int       `json:"conversions"`
	EstimatedContribution float64   `json:"estimatedContribution"`
	OccurredAt            time.Time `json:"occurredAt"`
}

// AdminProduct is the admin-facing affiliate or merchandise product model.
type AdminProduct struct {
	ID                    string                   `json:"id"`
	Type                  string                   `json:"type"`
	Name                  string                   `json:"name"`
	Slug                  string                   `json:"slug"`
	Brand                 string                   `json:"brand"`
	SKU                   string                   `json:"sku,omitempty"`
	Price                 float64                  `json:"price"`
	Currency              string                   `json:"currency"`
	ImageURL              string                   `json:"imageUrl"`
	GalleryImages         []string                 `json:"galleryImages"`
	CategoryID            string                   `json:"categoryId"`
	CategoryName          string                   `json:"categoryName"`
	AffiliateURL          string                   `json:"affiliateUrl,omitempty"`
	LinkedCauseID         string                   `json:"linkedCauseId"`
	LinkedCauseName       string                   `json:"linkedCauseName"`
	AllocationPercent     float64                  `json:"allocationPercent"`
	Description           string                   `json:"description"`
	Status                string                   `json:"status"`
	Featured              bool                     `json:"featured"`
	ClickCount            int                      `json:"clickCount"`
	ConversionCount       int                      `json:"conversionCount"`
	EstimatedContribution float64                  `json:"estimatedContribution"`
	InventoryQuantity     *int                     `json:"inventoryQuantity,omitempty"`
	LowStockThreshold     *int                     `json:"lowStockThreshold,omitempty"`
	Variants              []AdminProductVariant    `json:"variants"`
	Conversions           []AdminProductConversion `json:"conversions"`
	CreatedAt             time.Time                `json:"createdAt"`
	UpdatedAt             time.Time                `json:"updatedAt"`
}

// AdminProductCategory organizes affiliate and merch products.
type AdminProductCategory struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Slug         string    `json:"slug"`
	Type         string    `json:"type"`
	Description  string    `json:"description"`
	ProductCount int       `json:"productCount"`
	Status       string    `json:"status"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// AdminProductSummary provides product commerce rollups.
type AdminProductSummary struct {
	TotalCount            int     `json:"totalCount"`
	PublishedCount        int     `json:"publishedCount"`
	DraftCount            int     `json:"draftCount"`
	ArchivedCount         int     `json:"archivedCount"`
	FeaturedCount         int     `json:"featuredCount"`
	LowStockCount         int     `json:"lowStockCount"`
	ClickCount            int     `json:"clickCount"`
	ConversionCount       int     `json:"conversionCount"`
	EstimatedContribution float64 `json:"estimatedContribution"`
}

// AdminReportSummary provides cross-domain analytics rollups.
type AdminReportSummary struct {
	DonationTotal           float64 `json:"donationTotal"`
	DonationCount           int     `json:"donationCount"`
	SuccessfulDonationCount int     `json:"successfulDonationCount"`
	AverageDonation         float64 `json:"averageDonation"`
	ActiveCampaignCount     int     `json:"activeCampaignCount"`
	CampaignProgressPercent int     `json:"campaignProgressPercent"`
	DonorCount              int     `json:"donorCount"`
	NewDonorCount           int     `json:"newDonorCount"`
	ReturningDonorCount     int     `json:"returningDonorCount"`
	ContentUpdateCount      int     `json:"contentUpdateCount"`
	PublishedContentCount   int     `json:"publishedContentCount"`
	ProductClicks           int     `json:"productClicks"`
	ProductConversions      int     `json:"productConversions"`
	ProductContribution     float64 `json:"productContribution"`
}

// AdminDonationReportRecord is a compact row used to rebuild donation trends.
type AdminDonationReportRecord struct {
	ID           string    `json:"id"`
	CampaignName string    `json:"campaignName"`
	Status       string    `json:"status"`
	Method       string    `json:"method"`
	Amount       float64   `json:"amount"`
	Currency     string    `json:"currency"`
	CreatedAt    time.Time `json:"createdAt"`
}

// AdminDonationTrendPoint is an aggregated donation chart row.
type AdminDonationTrendPoint struct {
	ID                    string  `json:"id"`
	Label                 string  `json:"label"`
	Date                  string  `json:"date"`
	DonationCount         int     `json:"donationCount"`
	SuccessfulCount       int     `json:"successfulCount"`
	PendingCount          int     `json:"pendingCount"`
	FailedOrRefundedCount int     `json:"failedOrRefundedCount"`
	Amount                float64 `json:"amount"`
}

// AdminCampaignPerformanceReport captures campaign analytics rows.
type AdminCampaignPerformanceReport struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	Category        string    `json:"category"`
	Status          string    `json:"status"`
	Raised          float64   `json:"raised"`
	Goal            float64   `json:"goal"`
	Currency        string    `json:"currency"`
	DonorCount      int       `json:"donorCount"`
	AverageDonation float64   `json:"averageDonation"`
	ProgressPercent int       `json:"progressPercent"`
	ConversionRate  int       `json:"conversionRate"`
	UpdatedAt       time.Time `json:"updatedAt"`
	Path            string    `json:"path"`
}

// AdminDonorGrowthPoint captures donor acquisition and retention rollups.
type AdminDonorGrowthPoint struct {
	ID              string  `json:"id"`
	Label           string  `json:"label"`
	Date            string  `json:"date"`
	NewDonors       int     `json:"newDonors"`
	ReturningDonors int     `json:"returningDonors"`
	TotalDonors     int     `json:"totalDonors"`
	AverageDonation float64 `json:"averageDonation"`
}

// AdminContentPerformanceReport captures blog and CMS performance rows.
type AdminContentPerformanceReport struct {
	ID                string    `json:"id"`
	Title             string    `json:"title"`
	Type              string    `json:"type"`
	Status            string    `json:"status"`
	Views             int       `json:"views"`
	UniqueVisitors    int       `json:"uniqueVisitors"`
	ConversionAssists int       `json:"conversionAssists"`
	UpdatedAt         time.Time `json:"updatedAt"`
	Path              string    `json:"path"`
}

// AdminProductPerformanceReport captures affiliate and merch reporting rows.
type AdminProductPerformanceReport struct {
	ID                    string    `json:"id"`
	Name                  string    `json:"name"`
	Type                  string    `json:"type"`
	Status                string    `json:"status"`
	LinkedCauseName       string    `json:"linkedCauseName"`
	Clicks                int       `json:"clicks"`
	Conversions           int       `json:"conversions"`
	ConversionRate        float64   `json:"conversionRate"`
	EstimatedContribution float64   `json:"estimatedContribution"`
	UpdatedAt             time.Time `json:"updatedAt"`
	Path                  string    `json:"path"`
}

// AdminReportExportItem describes an available report export.
type AdminReportExportItem struct {
	ID          string    `json:"id"`
	Label       string    `json:"label"`
	Section     string    `json:"section"`
	Description string    `json:"description"`
	RowCount    int       `json:"rowCount"`
	Format      string    `json:"format"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// AdminReportFilterOptions lists values available in report filters.
type AdminReportFilterOptions struct {
	Campaigns        []string `json:"campaigns"`
	DonationStatuses []string `json:"donationStatuses"`
	PaymentMethods   []string `json:"paymentMethods"`
	ProductTypes     []string `json:"productTypes"`
	ContentTypes     []string `json:"contentTypes"`
}

// AdminReportsResponse is the admin reporting dashboard payload.
type AdminReportsResponse struct {
	GeneratedAt         time.Time                            `json:"generatedAt"`
	Summary             AdminReportSummary                   `json:"summary"`
	DonationRecords     []AdminDonationReportRecord          `json:"donationRecords"`
	DonationTrends      map[string][]AdminDonationTrendPoint `json:"donationTrends"`
	CampaignPerformance []AdminCampaignPerformanceReport     `json:"campaignPerformance"`
	DonorGrowth         []AdminDonorGrowthPoint              `json:"donorGrowth"`
	ContentPerformance  []AdminContentPerformanceReport      `json:"contentPerformance"`
	ProductPerformance  []AdminProductPerformanceReport      `json:"productPerformance"`
	Exports             []AdminReportExportItem              `json:"exports"`
	FilterOptions       AdminReportFilterOptions             `json:"filterOptions"`
}

// AdminNotificationPreference captures admin alert delivery settings.
type AdminNotificationPreference struct {
	Key         string `json:"key"`
	Label       string `json:"label"`
	Description string `json:"description"`
	Email       bool   `json:"email"`
	InApp       bool   `json:"inApp"`
}

// AdminGeneralSettings captures platform-wide defaults.
type AdminGeneralSettings struct {
	SiteName           string `json:"siteName"`
	SupportEmail       string `json:"supportEmail"`
	Timezone           string `json:"timezone"`
	DefaultCurrency    string `json:"defaultCurrency"`
	MaintenanceMode    bool   `json:"maintenanceMode"`
	MaintenanceMessage string `json:"maintenanceMessage"`
}

// AdminBrandingSettings captures admin-managed brand assets.
type AdminBrandingSettings struct {
	LogoURL               string `json:"logoUrl"`
	FaviconURL            string `json:"faviconUrl"`
	PrimaryColor          string `json:"primaryColor"`
	SecondaryColor        string `json:"secondaryColor"`
	SocialPreviewImageURL string `json:"socialPreviewImageUrl"`
}

// AdminPaymentSettings captures payment method and donation defaults.
type AdminPaymentSettings struct {
	EnabledMethods  []string `json:"enabledMethods"`
	DefaultCurrency string   `json:"defaultCurrency"`
	MinimumDonation float64  `json:"minimumDonation"`
	StripeVisible   bool     `json:"stripeVisible"`
	PaypalVisible   bool     `json:"paypalVisible"`
	CryptoVisible   bool     `json:"cryptoVisible"`
	WebhookStatus   string   `json:"webhookStatus"`
}

// AdminSocialLinksSettings captures public social destinations.
type AdminSocialLinksSettings struct {
	Facebook  string `json:"facebook"`
	XTwitter  string `json:"xTwitter"`
	Instagram string `json:"instagram"`
	LinkedIn  string `json:"linkedIn"`
	Youtube   string `json:"youtube"`
}

// AdminFooterLink captures one footer link.
type AdminFooterLink struct {
	ID    string `json:"id"`
	Label string `json:"label"`
	URL   string `json:"url"`
}

// AdminFooterLinkGroup captures grouped footer navigation.
type AdminFooterLinkGroup struct {
	ID    string            `json:"id"`
	Title string            `json:"title"`
	Links []AdminFooterLink `json:"links"`
}

// AdminFooterSettings captures footer content and newsletter visibility.
type AdminFooterSettings struct {
	ContactEmail      string                 `json:"contactEmail"`
	ContactPhone      string                 `json:"contactPhone"`
	Address           string                 `json:"address"`
	NewsletterEnabled bool                   `json:"newsletterEnabled"`
	LinkGroups        []AdminFooterLinkGroup `json:"linkGroups"`
	LegalLinks        []AdminFooterLink      `json:"legalLinks"`
}

// AdminAccountSettings captures the current admin profile shell settings.
type AdminAccountSettings struct {
	DisplayName  string `json:"displayName"`
	Email        string `json:"email"`
	AvatarURL    string `json:"avatarUrl"`
	Role         string `json:"role"`
	AuthProvider string `json:"authProvider"`
}

// AdminRolePermissionOverview describes practical admin role access.
type AdminRolePermissionOverview struct {
	Role        string   `json:"role"`
	Label       string   `json:"label"`
	Description string   `json:"description"`
	Permissions []string `json:"permissions"`
}

// AdminSecuritySettings captures practical security policy controls.
type AdminSecuritySettings struct {
	SessionTimeoutMinutes int                           `json:"sessionTimeoutMinutes"`
	RequireTwoFactor      bool                          `json:"requireTwoFactor"`
	PasswordPolicy        string                        `json:"passwordPolicy"`
	AuditRetentionDays    int                           `json:"auditRetentionDays"`
	Roles                 []AdminRolePermissionOverview `json:"roles"`
}

// AdminSettings is the full settings payload.
type AdminSettings struct {
	General       AdminGeneralSettings          `json:"general"`
	Branding      AdminBrandingSettings         `json:"branding"`
	Payments      AdminPaymentSettings          `json:"payments"`
	Social        AdminSocialLinksSettings      `json:"social"`
	Footer        AdminFooterSettings           `json:"footer"`
	Account       AdminAccountSettings          `json:"account"`
	Security      AdminSecuritySettings         `json:"security"`
	Notifications []AdminNotificationPreference `json:"notifications"`
	UpdatedAt     time.Time                     `json:"updatedAt"`
	UpdatedBy     string                        `json:"updatedBy"`
}

// AdminSettingsSummary provides settings dashboard rollups.
type AdminSettingsSummary struct {
	MaintenanceMode               bool      `json:"maintenanceMode"`
	EnabledPaymentMethodCount     int       `json:"enabledPaymentMethodCount"`
	UnreadCriticalPreferenceCount int       `json:"unreadCriticalPreferenceCount"`
	RoleCount                     int       `json:"roleCount"`
	LastUpdatedAt                 time.Time `json:"lastUpdatedAt"`
}

// AdminNotification is an admin alert record.
type AdminNotification struct {
	ID          string     `json:"id"`
	Type        string     `json:"type"`
	Title       string     `json:"title"`
	Summary     string     `json:"summary"`
	Status      string     `json:"status"`
	Severity    string     `json:"severity"`
	SourceLabel string     `json:"sourceLabel"`
	SourcePath  string     `json:"sourcePath"`
	CreatedAt   time.Time  `json:"createdAt"`
	ReadAt      *time.Time `json:"readAt,omitempty"`
}

// AdminNotificationSummary provides alert counts.
type AdminNotificationSummary struct {
	TotalCount    int `json:"totalCount"`
	UnreadCount   int `json:"unreadCount"`
	CriticalCount int `json:"criticalCount"`
	ArchivedCount int `json:"archivedCount"`
}

// AdminAuditLog captures one admin action event.
type AdminAuditLog struct {
	ID          string                 `json:"id"`
	Actor       string                 `json:"actor"`
	ActorRole   string                 `json:"actorRole"`
	Action      string                 `json:"action"`
	EntityType  string                 `json:"entityType"`
	EntityLabel string                 `json:"entityLabel"`
	EntityID    string                 `json:"entityId"`
	Timestamp   time.Time              `json:"timestamp"`
	IPAddress   string                 `json:"ipAddress"`
	Device      string                 `json:"device"`
	Severity    string                 `json:"severity"`
	Before      map[string]interface{} `json:"before"`
	After       map[string]interface{} `json:"after"`
	Metadata    map[string]string      `json:"metadata"`
}

// AdminAuditSummary provides audit counts.
type AdminAuditSummary struct {
	TotalCount          int `json:"totalCount"`
	CriticalCount       int `json:"criticalCount"`
	SettingsChangeCount int `json:"settingsChangeCount"`
	ApprovalActionCount int `json:"approvalActionCount"`
}

// AdminApprovalComment captures reviewer/requester discussion.
type AdminApprovalComment struct {
	ID        string    `json:"id"`
	Author    string    `json:"author"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"createdAt"`
}

// AdminApprovalRequest captures admin approval workflow rows.
type AdminApprovalRequest struct {
	ID                 string                 `json:"id"`
	Type               string                 `json:"type"`
	Status             string                 `json:"status"`
	Priority           string                 `json:"priority"`
	Title              string                 `json:"title"`
	Summary            string                 `json:"summary"`
	RequestedBy        string                 `json:"requestedBy"`
	SubmittedAt        time.Time              `json:"submittedAt"`
	RelatedEntityID    string                 `json:"relatedEntityId"`
	RelatedEntityLabel string                 `json:"relatedEntityLabel"`
	RelatedEntityPath  string                 `json:"relatedEntityPath"`
	Impact             string                 `json:"impact"`
	Reviewer           string                 `json:"reviewer,omitempty"`
	ReviewedAt         *time.Time             `json:"reviewedAt,omitempty"`
	Comments           []AdminApprovalComment `json:"comments"`
}

// AdminApprovalSummary provides approval queue counts.
type AdminApprovalSummary struct {
	TotalCount    int `json:"totalCount"`
	PendingCount  int `json:"pendingCount"`
	ApprovedCount int `json:"approvedCount"`
	RejectedCount int `json:"rejectedCount"`
	UrgentCount   int `json:"urgentCount"`
}
