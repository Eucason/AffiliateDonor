package models

import "time"

// Cause represents a charitable organization
type Cause struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	Goal        float64   `json:"goal"`
	Raised      float64   `json:"raised"`
	Supporters  int       `json:"supporters"`
	Location    string    `json:"location"`
	StartDate   time.Time `json:"start_date"`
	Verified    bool      `json:"verified"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Donation represents a donation transaction
type Donation struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	CauseID   string    `json:"cause_id"`
	Amount    float64   `json:"amount"`
	Currency  string    `json:"currency"`
	Method    string    `json:"method"`
	Status    string    `json:"status"` // pending, completed, failed
	TxHash    string    `json:"tx_hash,omitempty"` // for crypto
	CreatedAt time.Time `json:"created_at"`
}

// Product represents an affiliate product
type Product struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	Brand           string    `json:"brand"`
	Price           float64   `json:"price"`
	Image           string    `json:"image"`
	Category        string    `json:"category"`
	AffiliateLink   string    `json:"affiliate_link"`
	CauseID         string    `json:"cause_id"`
	DonationPercent float64   `json:"donation_percent"`
	Description     string    `json:"description"`
	CreatedAt       time.Time `json:"created_at"`
}

// User represents a platform user
type User struct {
	ID              string    `json:"id" db:"id"`
	Email           string    `json:"email" db:"email"`
	Name            string    `json:"name" db:"name"`
	ProfileImage    string    `json:"profile_image" db:"profile_image"`
	TotalDonations  float64   `json:"total_donations" db:"total_donations"`
	TotalPurchases  int       `json:"total_purchases" db:"total_purchases"`
	CausesSupported int       `json:"causes_supported" db:"causes_supported"`
	ImpactScore     int       `json:"impact_score" db:"impact_score"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

// AffiliateClick tracks affiliate link clicks
type AffiliateClick struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	ProductID string    `json:"product_id"`
	ClickedAt time.Time `json:"clicked_at"`
	Converted bool      `json:"converted"`
	IPAddress string    `json:"ip_address"`
}

// Payment represents a payment transaction
type Payment struct {
	ID            string    `json:"id"`
	UserID        string    `json:"user_id"`
	Amount        float64   `json:"amount"`
	Currency      string    `json:"currency"`
	Method        string    `json:"method"` // card, paypal, venmo, crypto, etc.
	Status        string    `json:"status"` // pending, succeeded, failed
	StripeID      string    `json:"stripe_id,omitempty"`
	PayPalID      string    `json:"paypal_id,omitempty"`
	CryptoAddress string    `json:"crypto_address,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
}

// CryptoPayment represents a cryptocurrency payment
type CryptoPayment struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Amount    float64   `json:"amount"`
	CryptoType string   `json:"crypto_type"` // btc, eth, ltc, usdc, usdt, bnb
	Address   string    `json:"address"`
	TxHash    string    `json:"tx_hash"`
	Status    string    `json:"status"` // pending, confirmed, failed
	CreatedAt time.Time `json:"created_at"`
}
