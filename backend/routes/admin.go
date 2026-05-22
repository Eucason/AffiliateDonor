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

		users := admin.Group("/users")
		{
			users.GET("", adminhandlers.GetAdminUsers)
			users.GET("/:id", adminhandlers.GetAdminUser)
			users.PATCH("/:id/role", adminhandlers.UpdateAdminUserRole)
			users.POST("/:id/notes", adminhandlers.AddAdminUserNote)
		}

		messages := admin.Group("/messages")
		{
			messages.GET("", adminhandlers.GetAdminMessages)
			messages.GET("/:id", adminhandlers.GetAdminMessage)
			messages.PATCH("/:id/status", adminhandlers.UpdateAdminMessageStatus)
			messages.PATCH("/:id/assignment", adminhandlers.AssignAdminMessage)
			messages.POST("/:id/notes", adminhandlers.AddAdminMessageNote)
		}

		content := admin.Group("/content")
		{
			content.GET("", adminhandlers.GetAdminContentBlocks)
			content.GET("/:id", adminhandlers.GetAdminContentBlock)
			content.PUT("/:id", adminhandlers.UpdateAdminContentBlock)
			content.PATCH("/:id/status", adminhandlers.UpdateAdminContentStatus)
		}

		media := admin.Group("/media")
		{
			media.GET("", adminhandlers.GetAdminMediaAssets)
			media.GET("/:id", adminhandlers.GetAdminMediaAsset)
			media.POST("", adminhandlers.CreateAdminMediaAsset)
			media.PUT("/:id", adminhandlers.UpdateAdminMediaAsset)
			media.DELETE("/:id", adminhandlers.DeleteAdminMediaAsset)
		}

		products := admin.Group("/products")
		{
			products.GET("", adminhandlers.GetAdminProducts)
			products.POST("", adminhandlers.CreateAdminProduct)
			products.GET("/categories", adminhandlers.GetAdminProductCategories)
			products.POST("/categories", adminhandlers.SaveAdminProductCategory)
			products.PUT("/categories/:id", adminhandlers.SaveAdminProductCategory)
			products.GET("/:id", adminhandlers.GetAdminProduct)
			products.PUT("/:id", adminhandlers.UpdateAdminProduct)
			products.PATCH("/:id/status", adminhandlers.UpdateAdminProductStatus)
			products.PATCH("/:id/inventory", adminhandlers.UpdateAdminProductInventory)
			products.DELETE("/:id", adminhandlers.DeleteAdminProduct)
		}
	}
}
