package handlers

import (
	"net/http"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

var mockProducts = []models.Product{
	{
		ID:              "p1",
		Name:            "Eco-Friendly Water Bottle",
		Brand:           "EcoLife",
		Price:           24.99,
		Image:           "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
		Category:        "Home",
		AffiliateLink:   "https://amazon.com/example",
		CauseID:         "1",
		DonationPercent: 10.0,
		Description:     "Sustainable stainless steel water bottle",
		CreatedAt:       time.Now(),
	},
	{
		ID:              "p2",
		Name:            "Organic Cotton T-Shirt",
		Brand:           "GreenThread",
		Price:           29.99,
		Image:           "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
		Category:        "Fashion",
		AffiliateLink:   "https://amazon.com/example",
		CauseID:         "2",
		DonationPercent: 15.0,
		Description:     "100% organic cotton, ethically made",
		CreatedAt:       time.Now(),
	},
}

func GetProducts(c *gin.Context) {
	category := c.Query("category")
	causeID := c.Query("cause_id")

	products := mockProducts
	if category != "" && category != "All" {
		filtered := []models.Product{}
		for _, p := range products {
			if p.Category == category {
				filtered = append(filtered, p)
			}
		}
		products = filtered
	}

	if causeID != "" {
		filtered := []models.Product{}
		for _, p := range products {
			if p.CauseID == causeID {
				filtered = append(filtered, p)
			}
		}
		products = filtered
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"total":    len(products),
	})
}

func GetProduct(c *gin.Context) {
	id := c.Param("id")

	for _, product := range mockProducts {
		if product.ID == id {
			c.JSON(http.StatusOK, product)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
}

func SearchProducts(c *gin.Context) {
	var req struct {
		Query    string `json:"query"`
		Category string `json:"category"`
		MinPrice float64 `json:"min_price"`
		MaxPrice float64 `json:"max_price"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production: Search via Elasticsearch or database
	// For now, return mock results
	c.JSON(http.StatusOK, gin.H{
		"products": mockProducts,
		"total":    len(mockProducts),
		"query":    req.Query,
	})
}
