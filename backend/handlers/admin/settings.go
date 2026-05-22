package admin

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// GetAdminSettings returns the full settings payload for the system admin page.
func GetAdminSettings(c *gin.Context) {
	settings := adminSettingsFixture()

	c.JSON(http.StatusOK, gin.H{
		"settings": settings,
		"summary":  summarizeAdminSettings(settings),
	})
}

// UpdateAdminSettings accepts the complete settings payload and returns the updated shape.
func UpdateAdminSettings(c *gin.Context) {
	var req struct {
		Settings models.AdminSettings `json:"settings" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	settings := req.Settings
	settings.UpdatedAt = time.Now().UTC()
	if settings.UpdatedBy == "" {
		settings.UpdatedBy = "Admin Team"
	}

	c.JSON(http.StatusOK, gin.H{
		"settings": settings,
		"summary":  summarizeAdminSettings(settings),
	})
}

func adminSettingsFixture() models.AdminSettings {
	now := time.Now().UTC()

	return models.AdminSettings{
		General: models.AdminGeneralSettings{
			SiteName:           "AffiliateDonor",
			SupportEmail:       "support@affiliatedonor.example",
			Timezone:           "America/New_York",
			DefaultCurrency:    "USD",
			MaintenanceMode:    false,
			MaintenanceMessage: "Scheduled maintenance is in progress. Please check back shortly.",
		},
		Branding: models.AdminBrandingSettings{
			LogoURL:               "/images/logo.png",
			FaviconURL:            "/favicon.ico",
			PrimaryColor:          "#0f766e",
			SecondaryColor:        "#7c3aed",
			SocialPreviewImageURL: "/images/social-preview.jpg",
		},
		Payments: models.AdminPaymentSettings{
			EnabledMethods:  []string{"card", "paypal", "bank_transfer"},
			DefaultCurrency: "USD",
			MinimumDonation: 5,
			StripeVisible:   true,
			PaypalVisible:   true,
			CryptoVisible:   false,
			WebhookStatus:   "healthy",
		},
		Social: models.AdminSocialLinksSettings{
			Facebook:  "https://facebook.com/affiliatedonor",
			XTwitter:  "https://x.com/affiliatedonor",
			Instagram: "https://instagram.com/affiliatedonor",
			LinkedIn:  "https://linkedin.com/company/affiliatedonor",
			Youtube:   "",
		},
		Footer: models.AdminFooterSettings{
			ContactEmail:      "hello@affiliatedonor.example",
			ContactPhone:      "+1 555 0148",
			Address:           "120 Giving Lane, Austin, TX",
			NewsletterEnabled: true,
			LinkGroups: []models.AdminFooterLinkGroup{
				{
					ID:    "footer-causes",
					Title: "Causes",
					Links: []models.AdminFooterLink{
						{ID: "footer-causes-active", Label: "Active Causes", URL: "/causes"},
						{ID: "footer-causes-how", Label: "How It Works", URL: "/how-it-works"},
					},
				},
			},
			LegalLinks: []models.AdminFooterLink{
				{ID: "legal-terms", Label: "Terms", URL: "/terms"},
				{ID: "legal-faqs", Label: "FAQs", URL: "/faqs"},
			},
		},
		Account: models.AdminAccountSettings{
			DisplayName:  "Olivia Grant",
			Email:        "olivia@example.com",
			AvatarURL:    "",
			Role:         "admin",
			AuthProvider: "Supabase Auth",
		},
		Security: models.AdminSecuritySettings{
			SessionTimeoutMinutes: 60,
			RequireTwoFactor:      false,
			PasswordPolicy:        "Minimum 12 characters with a number and symbol.",
			AuditRetentionDays:    365,
			Roles: []models.AdminRolePermissionOverview{
				adminRole("owner", "Owner", "Full system settings and approval access.", []string{"settings:write", "users:write", "approvals:write"}),
				adminRole("admin", "Admin", "Manage operations, campaigns, content, and users.", []string{"donations:write", "causes:write", "content:write"}),
				adminRole("editor", "Editor", "Manage publishing workflows and website content.", []string{"content:write", "approvals:read"}),
				adminRole("analyst", "Analyst", "Read reports, exports, and audit history.", []string{"reports:read", "audit:read"}),
				adminRole("support", "Support", "Review messages, donors, and donation context.", []string{"messages:write", "users:read"}),
			},
		},
		Notifications: adminNotificationPreferences(),
		UpdatedAt:     now.Add(-2 * time.Hour),
		UpdatedBy:     "Admin Team",
	}
}

func adminRole(role string, label string, description string, permissions []string) models.AdminRolePermissionOverview {
	return models.AdminRolePermissionOverview{
		Role:        role,
		Label:       label,
		Description: description,
		Permissions: permissions,
	}
}

func adminNotificationPreferences() []models.AdminNotificationPreference {
	return []models.AdminNotificationPreference{
		{Key: "failedPayments", Label: "Failed payments", Description: "Payment failures and webhook issues.", Email: true, InApp: true},
		{Key: "newDonations", Label: "New donations", Description: "Successful contributions and donor activity.", Email: false, InApp: true},
		{Key: "contactMessages", Label: "Contact messages", Description: "New support and partner submissions.", Email: true, InApp: true},
		{Key: "campaignApprovals", Label: "Campaign approvals", Description: "Campaign submissions and verification changes.", Email: true, InApp: true},
		{Key: "contentApprovals", Label: "Content approvals", Description: "Blog posts, homepage blocks, and scheduled content.", Email: false, InApp: true},
		{Key: "lowInventory", Label: "Low inventory", Description: "Merch variants at or below stock threshold.", Email: true, InApp: true},
	}
}

func summarizeAdminSettings(settings models.AdminSettings) models.AdminSettingsSummary {
	enabledAlerts := 0
	for _, preference := range settings.Notifications {
		if preference.Email && preference.InApp {
			enabledAlerts++
		}
	}

	return models.AdminSettingsSummary{
		MaintenanceMode:               settings.General.MaintenanceMode,
		EnabledPaymentMethodCount:     len(settings.Payments.EnabledMethods),
		UnreadCriticalPreferenceCount: enabledAlerts,
		RoleCount:                     len(settings.Security.Roles),
		LastUpdatedAt:                 settings.UpdatedAt,
	}
}
