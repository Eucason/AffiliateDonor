package handlers

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// Mock data - in production, this would query Supabase
var mockBlogPosts = []models.BlogPost{
	{
		ID:             "1",
		Title:          "10 Ways to Make Your Shopping More Impactful",
		Slug:           "10-ways-to-make-your-shopping-more-impactful",
		Excerpt:        "Discover simple strategies to maximize the positive impact of your everyday purchases...",
		Content:        "Full content about making shopping more impactful...",
		ContentFormat:  "markdown",
		FeaturedImageURL: stringPtr("https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800"),
		Category:       stringPtr("Tips & Guides"),
		Tags:           []string{"shopping", "impact", "tips"},
		AuthorName:     "Sarah Johnson",
		Status:         models.BlogStatusPublished,
		SEOTitle:       stringPtr("10 Ways to Make Your Shopping More Impactful | AffiliateDonations"),
		SEODescription: stringPtr("Learn how to make your everyday shopping more impactful with these 10 simple strategies."),
		CreatedAt:      time.Now().AddDate(0, -1, 0),
		UpdatedAt:      time.Now().AddDate(0, -1, 0),
		PublishedAt:    timePtr(time.Now().AddDate(0, -1, 0)),
	},
	{
		ID:             "2",
		Title:          "How We Verify Our Charitable Partners",
		Slug:           "how-we-verify-our-charitable-partners",
		Excerpt:        "Transparency is key. Learn about our rigorous vetting process for cause partners...",
		Content:        "Full content about verifying charitable partners...",
		ContentFormat:  "markdown",
		FeaturedImageURL: stringPtr("https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"),
		Category:       stringPtr("Impact"),
		Tags:           []string{"transparency", "partners", "vetting"},
		AuthorName:     "David Park",
		Status:         models.BlogStatusPublished,
		SEOTitle:       stringPtr("How We Verify Our Charitable Partners | AffiliateDonations"),
		SEODescription: stringPtr("Learn about our rigorous vetting process for charitable partners and how we ensure transparency."),
		CreatedAt:      time.Now().AddDate(0, -2, 0),
		UpdatedAt:      time.Now().AddDate(0, -2, 0),
		PublishedAt:    timePtr(time.Now().AddDate(0, -2, 0)),
	},
	{
		ID:             "3",
		Title:          "The Rise of Conscious Consumerism",
		Slug:           "the-rise-of-conscious-consumerism",
		Excerpt:        "Exploring the growing movement of shoppers who vote with their wallets...",
		Content:        "Full content about conscious consumerism...",
		Status:         models.BlogStatusDraft,
		ContentFormat:  "markdown",
		FeaturedImageURL: stringPtr("https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800"),
		Category:       stringPtr("Trends"),
		Tags:           []string{"consumerism", "trends", "shopping"},
		AuthorName:     "Emma Rodriguez",
		CreatedAt:      time.Now().AddDate(0, -3, 0),
		UpdatedAt:      time.Now().AddDate(0, -3, 0),
	},
}

// Helper function to create string pointers
func stringPtr(s string) *string {
	return &s
}

// Helper function to create time pointers
func timePtr(t time.Time) *time.Time {
	return &t
}

// GetPublishedBlogs returns all published blog posts
func GetPublishedBlogs(c *gin.Context) {
	publishedPosts := []models.BlogPost{}
	for _, post := range mockBlogPosts {
		if post.Status == models.BlogStatusPublished {
			publishedPosts = append(publishedPosts, post)
		}
	}

	// Sort by published date, newest first
	for i := 0; i < len(publishedPosts); i++ {
		for j := i + 1; j < len(publishedPosts); j++ {
			if publishedPosts[i].PublishedAt != nil && publishedPosts[j].PublishedAt != nil &&
			   publishedPosts[i].PublishedAt.Before(*publishedPosts[j].PublishedAt) {
				publishedPosts[i], publishedPosts[j] = publishedPosts[j], publishedPosts[i]
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": publishedPosts,
		"total": len(publishedPosts),
	})
}

// GetPublishedBlogBySlug returns a single published blog post by slug
func GetPublishedBlogBySlug(c *gin.Context) {
	slug := c.Param("slug")

	for _, post := range mockBlogPosts {
		if post.Slug == slug && post.Status == models.BlogStatusPublished {
			c.JSON(http.StatusOK, post)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Blog post not found"})
}

// GetAdminBlogs returns all blog posts (including drafts) for admin users
func GetAdminBlogs(c *gin.Context) {
	// In a real implementation, this would be protected by admin auth middleware
	status := c.Query("status")

	posts := mockBlogPosts
	if status != "" && status != "all" {
		filtered := []models.BlogPost{}
		for _, post := range posts {
			if string(post.Status) == status {
				filtered = append(filtered, post)
			}
		}
		posts = filtered
	}

	// Sort by updated date, newest first
	for i := 0; i < len(posts); i++ {
		for j := i + 1; j < len(posts); j++ {
			if posts[i].UpdatedAt.Before(posts[j].UpdatedAt) {
				posts[i], posts[j] = posts[j], posts[i]
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"total": len(posts),
	})
}

// GetAdminBlogByID returns a single blog post by ID for admin users
func GetAdminBlogByID(c *gin.Context) {
	id := c.Param("id")

	for _, post := range mockBlogPosts {
		if post.ID == id {
			c.JSON(http.StatusOK, post)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Blog post not found"})
}

// CreateBlog creates a new blog post
func CreateBlog(c *gin.Context) {
	// In a real implementation, this would be protected by admin auth middleware
	var newPost models.BlogPost
	if err := c.ShouldBindJSON(&newPost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if newPost.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}
	if newPost.Slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Slug is required"})
		return
	}
	if newPost.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}
	if newPost.AuthorName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Author name is required"})
		return
	}

	// Check for duplicate slug
	for _, post := range mockBlogPosts {
		if post.Slug == newPost.Slug {
			c.JSON(http.StatusConflict, gin.H{"error": "Slug must be unique"})
			return
		}
	}

	// Set default values
	newPost.ID = generateID()
	newPost.CreatedAt = time.Now()
	newPost.UpdatedAt = time.Now()

	// Set published date if status is published
	if newPost.Status == models.BlogStatusPublished {
		newPost.PublishedAt = timePtr(time.Now())
	}

	// Set default content format if not provided
	if newPost.ContentFormat == "" {
		newPost.ContentFormat = "markdown"
	}

	// Add to mock data
	mockBlogPosts = append(mockBlogPosts, newPost)

	c.JSON(http.StatusCreated, newPost)
}

// UpdateBlog updates an existing blog post
func UpdateBlog(c *gin.Context) {
	// In a real implementation, this would be protected by admin auth middleware
	id := c.Param("id")

	var updatedPost models.BlogPost
	if err := c.ShouldBindJSON(&updatedPost); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate required fields
	if updatedPost.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}
	if updatedPost.Slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Slug is required"})
		return
	}
	if updatedPost.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content is required"})
		return
	}
	if updatedPost.AuthorName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Author name is required"})
		return
	}

	// Find the post to update
	for i, post := range mockBlogPosts {
		if post.ID == id {
			// Check for duplicate slug (excluding current post)
			for _, otherPost := range mockBlogPosts {
				if otherPost.ID != id && otherPost.Slug == updatedPost.Slug {
					c.JSON(http.StatusConflict, gin.H{"error": "Slug must be unique"})
					return
				}
			}

			// Preserve createdAt and set updatedAt
			updatedPost.ID = id
			updatedPost.CreatedAt = post.CreatedAt
			updatedPost.UpdatedAt = time.Now()

			// Set published date if status changed to published
			if updatedPost.Status == models.BlogStatusPublished && post.Status != models.BlogStatusPublished {
				updatedPost.PublishedAt = timePtr(time.Now())
			} else if updatedPost.Status == models.BlogStatusPublished && post.PublishedAt != nil {
				// Keep existing published date if already published
				updatedPost.PublishedAt = post.PublishedAt
			} else {
				// Clear published date if status is not published
				updatedPost.PublishedAt = nil
			}

			// Set default content format if not provided
			if updatedPost.ContentFormat == "" {
				updatedPost.ContentFormat = "markdown"
			}

			mockBlogPosts[i] = updatedPost
			c.JSON(http.StatusOK, updatedPost)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Blog post not found"})
}

// DeleteBlog deletes a blog post
func DeleteBlog(c *gin.Context) {
	// In a real implementation, this would be protected by admin auth middleware
	id := c.Param("id")

	for i, post := range mockBlogPosts {
		if post.ID == id {
			mockBlogPosts = append(mockBlogPosts[:i], mockBlogPosts[i+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "Blog post deleted successfully"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Blog post not found"})
}

// Simple ID generator for mock data
func generateID() string {
	return time.Now().Format("20060102150405") + string('a'+rune(len(mockBlogPosts)%26)) + string('a'+rune(len(mockBlogPosts)/26%26))
}