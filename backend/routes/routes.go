package routes

import (
	"github.com/affiliatedonor/backend/handlers"
	"github.com/affiliatedonor/backend/middleware"
	"github.com/gin-gonic/gin"
)

// SetupCauseRoutes sets up cause-related routes
func SetupCauseRoutes(rg *gin.RouterGroup) {
	causes := rg.Group("/causes")
	{
		causes.GET("", handlers.GetCauses)
		causes.GET("/:id", handlers.GetCause)
		causes.GET("/:id/donations", handlers.GetCauseDonations)
	}
}

// SetupDonationRoutes sets up donation-related routes
func SetupDonationRoutes(rg *gin.RouterGroup) {
	donations := rg.Group("/donations")
	{
		donations.POST("", handlers.CreateDonation)
		donations.GET("", handlers.GetDonations)
		donations.GET("/:id", handlers.GetDonation)
		donations.POST("/track", handlers.TrackDonation)
	}
}

// SetupProductRoutes sets up product/shopping routes
func SetupProductRoutes(rg *gin.RouterGroup) {
	products := rg.Group("/products")
	{
		products.GET("", handlers.GetProducts)
		products.GET("/:id", handlers.GetProduct)
		products.POST("/search", handlers.SearchProducts)
	}
}

// SetupPaymentRoutes sets up payment-related routes
func SetupPaymentRoutes(rg *gin.RouterGroup) {
	payments := rg.Group("/payments")
	{
		payments.POST("/initiate", handlers.InitiatePayment)
		payments.POST("/stripe/webhook", handlers.StripeWebhook)
		payments.POST("/paypal/webhook", handlers.PayPalWebhook)
		payments.GET("/:id/status", handlers.GetPaymentStatus)
	}
}

// SetupAffiliateRoutes sets up affiliate tracking routes
func SetupAffiliateRoutes(rg *gin.RouterGroup) {
	affiliates := rg.Group("/affiliates")
	{
		affiliates.POST("/click", handlers.TrackClick)
		affiliates.POST("/conversion", handlers.TrackConversion)
		affiliates.GET("/stats", handlers.GetAffiliateStats)
	}
}

// SetupUserRoutes sets up user-related routes
func SetupUserRoutes(rg *gin.RouterGroup) {
	users := rg.Group("/users")
	{
		users.GET("/me", handlers.GetCurrentUser)
		users.GET("/me/donations", handlers.GetUserDonations)
		users.GET("/me/impact", handlers.GetUserImpact)
		users.PUT("/me", handlers.UpdateUser)
	}
}

// SetupCryptoRoutes sets up cryptocurrency payment routes
func SetupCryptoRoutes(rg *gin.RouterGroup) {
	crypto := rg.Group("/crypto")
	{
		crypto.POST("/generate-address", handlers.GenerateCryptoAddress)
		crypto.POST("/verify-payment", handlers.VerifyCryptoPayment)
		crypto.GET("/payment/:id/status", handlers.GetCryptoPaymentStatus)
	}
}

// SetupBlogRoutes sets up blog-related routes
func SetupBlogRoutes(rg *gin.RouterGroup) {
	blogs := rg.Group("/blogs")
	{
		blogs.GET("", handlers.GetPublishedBlogs)
		blogs.GET("/:slug", handlers.GetPublishedBlogBySlug)
	}

	adminBlogs := rg.Group("/admin/blogs")
	adminBlogs.Use(middleware.SimpleAdminAuthMiddleware())
	{
		adminBlogs.GET("", handlers.GetAdminBlogs)
		adminBlogs.GET("/:id", handlers.GetAdminBlogByID)
		adminBlogs.POST("", handlers.CreateBlog)
		adminBlogs.PUT("/:id", handlers.UpdateBlog)
		adminBlogs.DELETE("/:id", handlers.DeleteBlog)
	}
}

// SetupWebSocket sets up WebSocket for real-time updates
func SetupWebSocket(router *gin.Engine) {
	router.GET("/ws", handlers.HandleWebSocket)
}
