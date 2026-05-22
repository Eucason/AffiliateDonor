package routes

import (
	adminhandlers "github.com/affiliatedonor/backend/handlers/admin"
	"github.com/affiliatedonor/backend/middleware"
	"github.com/gin-gonic/gin"
)

// SetupAdminRoutes sets up protected admin API routes.
func SetupAdminRoutes(rg *gin.RouterGroup) {
	admin := rg.Group("/admin")
	admin.Use(middleware.SimpleAdminAuthMiddleware())
	{
		donations := admin.Group("/donations")
		{
			donations.GET("", adminhandlers.GetAdminDonations)
			donations.GET("/:id", adminhandlers.GetAdminDonation)
			donations.POST("/:id/reviewed", adminhandlers.MarkAdminDonationReviewed)
		}

		causes := admin.Group("/causes")
		{
			causes.GET("", adminhandlers.GetAdminCauses)
			causes.GET("/:id", adminhandlers.GetAdminCause)
			causes.POST("", adminhandlers.CreateAdminCause)
			causes.PUT("/:id", adminhandlers.UpdateAdminCause)
			causes.PATCH("/:id/status", adminhandlers.UpdateAdminCauseStatus)
		}
	}
}
