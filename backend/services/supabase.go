package services

import (
	"context"
	"fmt"
	"os"

	"github.com/supabase-community/supabase-go"
)

var supabaseClient *supabase.Client

// InitSupabase initializes the Supabase client
func InitSupabase() error {
	projectURL := os.Getenv("SUPABASE_URL")
	apiKey := os.Getenv("SUPABASE_ANON_KEY")

	if projectURL == "" || apiKey == "" {
		return fmt.Errorf("SUPABASE_URL or SUPABASE_ANON_KEY not set")
	}

	client, err := supabase.NewClient(projectURL, apiKey, nil)
	if err != nil {
		return fmt.Errorf("failed to initialize Supabase client: %w", err)
	}

	supabaseClient = client
	return nil
}

// GetSupabaseClient returns the Supabase client
func GetSupabaseClient() *supabase.Client {
	return supabaseClient
}

// UserProfile represents user data stored in database
type UserProfile struct {
	ID              string  `db:"id" json:"id"`
	Email           string  `db:"email" json:"email"`
	Name            string  `db:"name" json:"name"`
	ProfileImage    string  `db:"profile_image" json:"profile_image"`
	TotalDonations  float64 `db:"total_donations" json:"total_donations"`
	TotalPurchases  int     `db:"total_purchases" json:"total_purchases"`
	CausesSupported int     `db:"causes_supported" json:"causes_supported"`
	ImpactScore     int     `db:"impact_score" json:"impact_score"`
	CreatedAt       string  `db:"created_at" json:"created_at"`
	UpdatedAt       string  `db:"updated_at" json:"updated_at"`
}

// GetOrCreateUserProfile gets or creates a user profile
func GetOrCreateUserProfile(ctx context.Context, userID, email string) (*UserProfile, error) {
	if supabaseClient == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	// Try to get existing profile
	var profile UserProfile
	err := supabaseClient.DB.From("users").
		Select("*", "exact", false).
		Eq("id", userID).
		Single().
		ExecuteTo(&profile)

	if err == nil {
		return &profile, nil
	}

	// If user doesn't exist, create new profile
	newProfile := UserProfile{
		ID:              userID,
		Email:           email,
		Name:            "",
		TotalDonations:  0,
		TotalPurchases:  0,
		CausesSupported: 0,
		ImpactScore:     0,
	}

	err = supabaseClient.DB.From("users").
		Insert([]UserProfile{newProfile}, false, "representation", "", "").
		ExecuteTo(&newProfile)

	if err != nil {
		return nil, fmt.Errorf("failed to create user profile: %w", err)
	}

	return &newProfile, nil
}

// UpdateUserProfile updates a user profile
func UpdateUserProfile(ctx context.Context, profile *UserProfile) error {
	if supabaseClient == nil {
		return fmt.Errorf("Supabase client not initialized")
	}

	err := supabaseClient.DB.From("users").
		Update(profile, "", "").
		Eq("id", profile.ID).
		Execute()

	if err != nil {
		return fmt.Errorf("failed to update user profile: %w", err)
	}

	return nil
}

// GetUserByID retrieves a user profile by ID
func GetUserByID(ctx context.Context, userID string) (*UserProfile, error) {
	if supabaseClient == nil {
		return nil, fmt.Errorf("Supabase client not initialized")
	}

	var profile UserProfile
	err := supabaseClient.DB.From("users").
		Select("*", "exact", false).
		Eq("id", userID).
		Single().
		ExecuteTo(&profile)

	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	return &profile, nil
}
