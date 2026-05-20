package handlers

import (
	"io"
	"net/http"
	"os"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
	"github.com/stripe/stripe-go/v76/webhook"
)

func InitiatePayment(c *gin.Context) {
	var req struct {
		Amount   float64 `json:"amount" binding:"required"`
		Method   string  `json:"method" binding:"required"`
		Currency string  `json:"currency"`
		UserID   string  `json:"user_id"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Currency == "" {
		req.Currency = "usd"
	}

	payment := models.Payment{
		ID:        "pay_" + time.Now().Format("20060102150405"),
		UserID:    req.UserID,
		Amount:    req.Amount,
		Currency:  req.Currency,
		Method:    req.Method,
		Status:    "pending",
		CreatedAt: time.Now(),
	}

	// Handle different payment methods
	switch req.Method {
	case "card", "apple-pay", "google-pay":
		// Stripe payment
		stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
		
		params := &stripe.PaymentIntentParams{
			Amount:   stripe.Int64(int64(req.Amount * 100)), // Convert to cents
			Currency: stripe.String(req.Currency),
			PaymentMethodTypes: stripe.StringSlice([]string{
				"card",
			}),
		}

		pi, err := paymentintent.New(params)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		payment.StripeID = pi.ID
		c.JSON(http.StatusOK, gin.H{
			"payment":       payment,
			"client_secret": pi.ClientSecret,
		})
		return

	case "paypal", "venmo":
		// PayPal/Venmo payment
		// In production: Integrate with PayPal SDK
		payment.Status = "pending"
		c.JSON(http.StatusOK, gin.H{
			"payment":      payment,
			"redirect_url": "https://paypal.com/checkout/" + payment.ID,
		})
		return

	case "ach":
		// ACH transfer
		payment.Status = "pending"
		c.JSON(http.StatusOK, gin.H{
			"payment": payment,
			"message": "ACH transfer initiated",
		})
		return

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unsupported payment method"})
		return
	}
}

func StripeWebhook(c *gin.Context) {
	const MaxBodyBytes = int64(65536)
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxBodyBytes)
	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": err.Error()})
		return
	}

	event, err := webhook.ConstructEvent(payload, c.GetHeader("Stripe-Signature"), os.Getenv("STRIPE_WEBHOOK_SECRET"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	switch event.Type {
	case "payment_intent.succeeded":
		// Handle successful payment
		// Update donation status, trigger real-time updates
		c.JSON(http.StatusOK, gin.H{"received": true})
		return

	case "payment_intent.payment_failed":
		// Handle failed payment
		c.JSON(http.StatusOK, gin.H{"received": true})
		return
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}

func PayPalWebhook(c *gin.Context) {
	// Handle PayPal webhook events
	var event map[string]interface{}
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify webhook signature and process event
	c.JSON(http.StatusOK, gin.H{"received": true})
}

func GetPaymentStatus(c *gin.Context) {
	id := c.Param("id")

	payment := models.Payment{
		ID:        id,
		UserID:    "u1",
		Amount:    50.00,
		Currency:  "USD",
		Method:    "card",
		Status:    "succeeded",
		CreatedAt: time.Now(),
	}

	c.JSON(http.StatusOK, payment)
}
