package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

// Mock data - in production, this would query Supabase
var mockBlogPosts = []models.BlogPost{
	{
		ID:               "1",
		Title:            "10 Ways to Make Your Shopping More Impactful",
		Slug:             "10-ways-to-make-your-shopping-more-impactful",
		Excerpt:          "Discover simple strategies to maximize the positive impact of your everyday purchases...",
		Content:          "Full content about making shopping more impactful...",
		ContentFormat:    "markdown",
		FeaturedImageURL: stringPtr("https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800"),
		Category:         stringPtr("Tips & Guides"),
		Tags:             []string{"shopping", "impact", "tips"},
		AuthorName:       "Sarah Johnson",
		Status:           models.BlogStatusPublished,
		IsFeatured:       true,
		SEOTitle:         stringPtr("10 Ways to Make Your Shopping More Impactful | AffiliateDonations"),
		SEODescription:   stringPtr("Learn how to make your everyday shopping more impactful with these 10 simple strategies."),
		ReadTimeMinutes:  4,
		Performance:      blogPerformance(18420, 132),
		CreatedAt:        time.Now().AddDate(0, -1, 0),
		UpdatedAt:        time.Now().AddDate(0, -1, 0),
		PublishedAt:      timePtr(time.Now().AddDate(0, -1, 0)),
	},
	{
		ID:               "2",
		Title:            "How We Verify Our Charitable Partners",
		Slug:             "how-we-verify-our-charitable-partners",
		Excerpt:          "Transparency is key. Learn about our rigorous vetting process for cause partners...",
		Content:          "Full content about verifying charitable partners...",
		ContentFormat:    "markdown",
		FeaturedImageURL: stringPtr("https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"),
		Category:         stringPtr("Impact"),
		Tags:             []string{"transparency", "partners", "vetting"},
		AuthorName:       "David Park",
		Status:           models.BlogStatusPublished,
		IsFeatured:       false,
		SEOTitle:         stringPtr("How We Verify Our Charitable Partners | AffiliateDonations"),
		SEODescription:   stringPtr("Learn about our rigorous vetting process for charitable partners and how we ensure transparency."),
		ReadTimeMinutes:  3,
		Performance:      blogPerformance(12780, 96),
		CreatedAt:        time.Now().AddDate(0, -2, 0),
		UpdatedAt:        time.Now().AddDate(0, -2, 0),
		PublishedAt:      timePtr(time.Now().AddDate(0, -2, 0)),
	},
	{
		ID:               "3",
		Title:            "The Rise of Conscious Consumerism",
		Slug:             "the-rise-of-conscious-consumerism",
		Excerpt:          "Exploring the growing movement of shoppers who vote with their wallets...",
		Content:          "Full content about conscious consumerism...",
		Status:           models.BlogStatusDraft,
		ContentFormat:    "markdown",
		FeaturedImageURL: stringPtr("https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800"),
		Category:         stringPtr("Trends"),
		Tags:             []string{"consumerism", "trends", "shopping"},
		AuthorName:       "Emma Rodriguez",
		IsFeatured:       false,
		ReadTimeMinutes:  5,
		Performance:      blogPerformance(0, 0),
		CreatedAt:        time.Now().AddDate(0, -3, 0),
		UpdatedAt:        time.Now().AddDate(0, -3, 0),
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

func blogPerformance(views int, assists int) *models.BlogPostPerformance {
	lastViewedAt := time.Now().Add(-6 * time.Hour)
	if views == 0 {
		return &models.BlogPostPerformance{
			ViewCount:             0,
			UniqueVisitors:        0,
			AverageReadSeconds:    0,
			ConversionAssistCount: 0,
		}
	}

	return &models.BlogPostPerformance{
		ViewCount:             views,
		UniqueVisitors:        int(float64(views) * 0.72),
		AverageReadSeconds:    142,
		ConversionAssistCount: assists,
		LastViewedAt:          &lastViewedAt,
	}
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
	search := strings.ToLower(strings.TrimSpace(c.Query("search")))
	category := strings.TrimSpace(c.Query("category"))
	tag := strings.TrimSpace(c.Query("tag"))
	author := strings.TrimSpace(c.Query("author"))
	featured := strings.TrimSpace(c.Query("featured"))

	posts := mockBlogPosts
	if status != "" && status != "all" || search != "" || category != "" || tag != "" || author != "" || featured != "" {
		filtered := []models.BlogPost{}
		for _, post := range posts {
			if blogPostMatchesAdminFilters(post, status, search, category, tag, author, featured) {
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
		"posts":   posts,
		"total":   len(posts),
		"summary": summarizeBlogPosts(posts),
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
	newPost.ReadTimeMinutes = estimateBlogReadTime(newPost.Content)
	newPost.Performance = blogPerformance(0, 0)
	if newPost.Status == "" {
		newPost.Status = models.BlogStatusDraft
	}

	// Set default content format if not provided
	if newPost.ContentFormat == "" {
		newPost.ContentFormat = "markdown"
	}

	applyBlogWorkflowDates(&newPost, models.BlogStatusDraft)

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
			updatedPost.ReadTimeMinutes = estimateBlogReadTime(updatedPost.Content)
			updatedPost.Performance = post.Performance
			applyBlogWorkflowDates(&updatedPost, post.Status)

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

// UpdateBlogStatus updates the publishing workflow status for a post.
func UpdateBlogStatus(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		Status models.BlogStatus `json:"status"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i, post := range mockBlogPosts {
		if post.ID == id {
			post.Status = request.Status
			post.UpdatedAt = time.Now()
			applyBlogWorkflowDates(&post, mockBlogPosts[i].Status)
			mockBlogPosts[i] = post
			c.JSON(http.StatusOK, post)
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

func blogPostMatchesAdminFilters(post models.BlogPost, status string, search string, category string, tag string, author string, featured string) bool {
	if status != "" && status != "all" && string(post.Status) != status {
		return false
	}
	if category != "" && (post.Category == nil || *post.Category != category) {
		return false
	}
	if author != "" && post.AuthorName != author {
		return false
	}
	if featured == "featured" && !post.IsFeatured {
		return false
	}
	if featured == "standard" && post.IsFeatured {
		return false
	}
	if tag != "" && !containsBlogTag(post.Tags, tag) {
		return false
	}
	if search != "" {
		categoryValue := ""
		if post.Category != nil {
			categoryValue = *post.Category
		}
		searchable := strings.ToLower(strings.Join([]string{
			post.Title,
			post.Slug,
			post.AuthorName,
			categoryValue,
			post.Excerpt,
			strings.Join(post.Tags, " "),
		}, " "))
		return strings.Contains(searchable, search)
	}
	return true
}

func containsBlogTag(tags []string, tag string) bool {
	for _, item := range tags {
		if item == tag {
			return true
		}
	}
	return false
}

func summarizeBlogPosts(posts []models.BlogPost) gin.H {
	summary := gin.H{
		"total":     len(posts),
		"published": 0,
		"drafts":    0,
		"archived":  0,
		"scheduled": 0,
		"featured":  0,
	}

	for _, post := range posts {
		switch post.Status {
		case models.BlogStatusPublished:
			summary["published"] = summary["published"].(int) + 1
		case models.BlogStatusDraft:
			summary["drafts"] = summary["drafts"].(int) + 1
		case models.BlogStatusArchived:
			summary["archived"] = summary["archived"].(int) + 1
		case models.BlogStatusScheduled:
			summary["scheduled"] = summary["scheduled"].(int) + 1
		}
		if post.IsFeatured {
			summary["featured"] = summary["featured"].(int) + 1
		}
	}

	return summary
}

func applyBlogWorkflowDates(post *models.BlogPost, previousStatus models.BlogStatus) {
	now := time.Now()
	if post.Status == models.BlogStatusPublished {
		if previousStatus != models.BlogStatusPublished || post.PublishedAt == nil {
			post.PublishedAt = &now
		}
		post.ScheduledAt = nil
		post.ArchivedAt = nil
		return
	}

	if post.Status == models.BlogStatusArchived {
		if previousStatus != models.BlogStatusArchived || post.ArchivedAt == nil {
			post.ArchivedAt = &now
		}
		post.ScheduledAt = nil
		return
	}

	if post.Status != models.BlogStatusScheduled {
		post.ScheduledAt = nil
	}
	post.PublishedAt = nil
	post.ArchivedAt = nil
}

func estimateBlogReadTime(content string) int {
	words := len(strings.Fields(content))
	minutes := words / 225
	if words%225 != 0 {
		minutes++
	}
	if minutes < 1 {
		return 1
	}
	return minutes
}
