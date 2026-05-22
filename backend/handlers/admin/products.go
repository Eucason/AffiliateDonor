package admin

import (
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/affiliatedonor/backend/models"
	"github.com/gin-gonic/gin"
)

var mockAdminProductCategories = []models.AdminProductCategory{
	createAdminProductCategory("cat-home", "Home & Lifestyle", "affiliate", "Products that support everyday sustainable living.", 3),
	createAdminProductCategory("cat-fashion", "Ethical Fashion", "all", "Clothing and accessories with verified cause allocation.", 2),
	createAdminProductCategory("cat-tech", "Sustainable Tech", "affiliate", "Useful devices and accessories from aligned partners.", 1),
	createAdminProductCategory("cat-merch", "AffiliateDonor Merch", "merch", "Branded merch with direct profit allocation.", 3),
}

var mockAdminProducts = []models.AdminProduct{
	createAdminProduct(models.AdminProduct{
		ID:                    "p1",
		Type:                  "affiliate",
		Name:                  "Eco-Friendly Water Bottle",
		Slug:                  "eco-friendly-water-bottle",
		Brand:                 "EcoLife",
		Price:                 24.99,
		Currency:              "USD",
		ImageURL:              "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=900",
		GalleryImages:         []string{"https://images.unsplash.com/photo-1523362628745-0c100150b504?w=900"},
		CategoryID:            "cat-home",
		CategoryName:          "Home & Lifestyle",
		AffiliateURL:          "https://example.com/affiliate/eco-bottle",
		LinkedCauseID:         "clean-water",
		LinkedCauseName:       "Clean Water Initiative",
		AllocationPercent:     10,
		Description:           "Durable stainless steel bottle with affiliate proceeds supporting clean water campaigns.",
		Status:                "published",
		Featured:              true,
		ClickCount:            1324,
		ConversionCount:       86,
		EstimatedContribution: 2140,
	}, 5),
	createAdminProduct(models.AdminProduct{
		ID:                    "p2",
		Type:                  "affiliate",
		Name:                  "Solar Power Bank",
		Slug:                  "solar-power-bank",
		Brand:                 "SunCharge",
		Price:                 54.95,
		Currency:              "USD",
		ImageURL:              "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900",
		GalleryImages:         []string{},
		CategoryID:            "cat-tech",
		CategoryName:          "Sustainable Tech",
		AffiliateURL:          "https://example.com/affiliate/solar-bank",
		LinkedCauseID:         "climate-action",
		LinkedCauseName:       "Climate Action",
		AllocationPercent:     12,
		Description:           "Portable solar charging bank for travel and emergency kits.",
		Status:                "published",
		ClickCount:            788,
		ConversionCount:       44,
		EstimatedContribution: 1630,
	}, 28),
	createAdminProduct(models.AdminProduct{
		ID:                    "p3",
		Type:                  "affiliate",
		Name:                  "Organic Cotton Tote",
		Slug:                  "organic-cotton-tote",
		Brand:                 "GreenThread",
		Price:                 18.5,
		Currency:              "USD",
		ImageURL:              "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900",
		GalleryImages:         []string{},
		CategoryID:            "cat-fashion",
		CategoryName:          "Ethical Fashion",
		AffiliateURL:          "https://example.com/affiliate/cotton-tote",
		LinkedCauseID:         "education-for-all",
		LinkedCauseName:       "Education for All",
		AllocationPercent:     8,
		Description:           "Reusable organic cotton tote for everyday shopping.",
		Status:                "draft",
		ClickCount:            142,
		ConversionCount:       0,
		EstimatedContribution: 0,
	}, 64),
	createAdminProduct(models.AdminProduct{
		ID:                    "merch-1",
		Type:                  "merch",
		Name:                  "AffiliateDonor T-Shirt",
		Slug:                  "affiliatedonor-t-shirt",
		Brand:                 "AffiliateDonor",
		SKU:                   "AD-TEE-001",
		Price:                 32,
		Currency:              "USD",
		ImageURL:              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
		GalleryImages:         []string{"https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900"},
		CategoryID:            "cat-merch",
		CategoryName:          "AffiliateDonor Merch",
		LinkedCauseID:         "education-for-all",
		LinkedCauseName:       "Education for All",
		AllocationPercent:     35,
		Description:           "Soft organic cotton shirt with net proceeds allocated to education campaigns.",
		Status:                "published",
		Featured:              true,
		ClickCount:            942,
		ConversionCount:       117,
		EstimatedContribution: 2925,
		InventoryQuantity:     intPointer(184),
		LowStockThreshold:     intPointer(30),
		Variants: []models.AdminProductVariant{
			{ID: "tee-s", Name: "Small", SKU: "AD-TEE-S", InventoryQuantity: 48},
			{ID: "tee-m", Name: "Medium", SKU: "AD-TEE-M", InventoryQuantity: 71},
			{ID: "tee-l", Name: "Large", SKU: "AD-TEE-L", InventoryQuantity: 65},
		},
	}, 9),
	createAdminProduct(models.AdminProduct{
		ID:                    "merch-2",
		Type:                  "merch",
		Name:                  "Impact Hoodie",
		Slug:                  "impact-hoodie",
		Brand:                 "AffiliateDonor",
		SKU:                   "AD-HOOD-001",
		Price:                 68,
		Currency:              "USD",
		ImageURL:              "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900",
		GalleryImages:         []string{},
		CategoryID:            "cat-merch",
		CategoryName:          "AffiliateDonor Merch",
		LinkedCauseID:         "hunger-relief",
		LinkedCauseName:       "Hunger Relief",
		AllocationPercent:     30,
		Description:           "Midweight hoodie with profit allocation toward hunger relief logistics.",
		Status:                "published",
		ClickCount:            391,
		ConversionCount:       26,
		EstimatedContribution: 530,
		InventoryQuantity:     intPointer(12),
		LowStockThreshold:     intPointer(20),
		Variants: []models.AdminProductVariant{
			{ID: "hood-m", Name: "Medium", SKU: "AD-HOOD-M", InventoryQuantity: 4},
			{ID: "hood-l", Name: "Large", SKU: "AD-HOOD-L", InventoryQuantity: 8},
		},
	}, 16),
	createAdminProduct(models.AdminProduct{
		ID:                    "merch-3",
		Type:                  "merch",
		Name:                  "Donor Sticker Pack",
		Slug:                  "donor-sticker-pack",
		Brand:                 "AffiliateDonor",
		SKU:                   "AD-STICK-001",
		Price:                 8,
		Currency:              "USD",
		ImageURL:              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
		GalleryImages:         []string{},
		CategoryID:            "cat-merch",
		CategoryName:          "AffiliateDonor Merch",
		LinkedCauseID:         "clean-water",
		LinkedCauseName:       "Clean Water Initiative",
		AllocationPercent:     40,
		Description:           "Sticker set for donors and campaign ambassadors.",
		Status:                "archived",
		ClickCount:            121,
		ConversionCount:       18,
		EstimatedContribution: 58,
		InventoryQuantity:     intPointer(0),
		LowStockThreshold:     intPointer(25),
		Variants:              []models.AdminProductVariant{},
	}, 92),
}

// GetAdminProducts returns affiliate and merchandise products with categories.
func GetAdminProducts(c *gin.Context) {
	products := filterAdminProducts(mockAdminProducts, c.Query("type"))
	sort.SliceStable(products, func(i, j int) bool {
		return products[i].UpdatedAt.After(products[j].UpdatedAt)
	})

	c.JSON(http.StatusOK, gin.H{
		"products":   products,
		"categories": adminProductCategoriesWithCounts(),
		"summary":    summarizeAdminProducts(products),
	})
}

// GetAdminProduct returns one admin product.
func GetAdminProduct(c *gin.Context) {
	id := c.Param("id")
	for _, product := range mockAdminProducts {
		if product.ID == id || product.Slug == id {
			c.JSON(http.StatusOK, product)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
}

// CreateAdminProduct creates an admin product route shape for future persistence.
func CreateAdminProduct(c *gin.Context) {
	var request models.AdminProduct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(request.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product name is required"})
		return
	}

	now := time.Now().UTC()
	if request.ID == "" {
		request.ID = "prod-" + now.Format("20060102150405")
	}
	request.CreatedAt = now
	request.UpdatedAt = now
	normalizeAdminProduct(&request)
	mockAdminProducts = append(mockAdminProducts, request)

	c.JSON(http.StatusCreated, request)
}

// UpdateAdminProduct updates an admin product route shape.
func UpdateAdminProduct(c *gin.Context) {
	id := c.Param("id")
	var request models.AdminProduct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	index := findAdminProductIndex(id)
	if index < 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	request.ID = mockAdminProducts[index].ID
	request.CreatedAt = mockAdminProducts[index].CreatedAt
	request.UpdatedAt = time.Now().UTC()
	normalizeAdminProduct(&request)
	mockAdminProducts[index] = request
	c.JSON(http.StatusOK, request)
}

// UpdateAdminProductStatus updates workflow status for product publishing.
func UpdateAdminProductStatus(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	index := findAdminProductIndex(id)
	if index < 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	mockAdminProducts[index].Status = request.Status
	mockAdminProducts[index].UpdatedAt = time.Now().UTC()
	c.JSON(http.StatusOK, mockAdminProducts[index])
}

// UpdateAdminProductInventory updates merch inventory quantity.
func UpdateAdminProductInventory(c *gin.Context) {
	id := c.Param("id")
	var request struct {
		InventoryQuantity int `json:"inventoryQuantity"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	index := findAdminProductIndex(id)
	if index < 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	if mockAdminProducts[index].Type != "merch" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Inventory is only tracked for merch products"})
		return
	}

	mockAdminProducts[index].InventoryQuantity = intPointer(request.InventoryQuantity)
	mockAdminProducts[index].UpdatedAt = time.Now().UTC()
	c.JSON(http.StatusOK, mockAdminProducts[index])
}

// DeleteAdminProduct deletes a product from the mock admin catalog.
func DeleteAdminProduct(c *gin.Context) {
	id := c.Param("id")
	index := findAdminProductIndex(id)
	if index < 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	mockAdminProducts = append(mockAdminProducts[:index], mockAdminProducts[index+1:]...)
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}

// GetAdminProductCategories returns product taxonomy metadata.
func GetAdminProductCategories(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"categories": adminProductCategoriesWithCounts()})
}

// SaveAdminProductCategory upserts product taxonomy metadata.
func SaveAdminProductCategory(c *gin.Context) {
	id := c.Param("id")
	var request models.AdminProductCategory
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(request.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category name is required"})
		return
	}

	if id != "" {
		request.ID = id
	}
	if request.ID == "" {
		request.ID = "cat-" + time.Now().UTC().Format("20060102150405")
	}
	if request.Slug == "" {
		request.Slug = slugifyAdminProduct(request.Name)
	}
	if request.Type == "" {
		request.Type = "all"
	}
	if request.Status == "" {
		request.Status = "active"
	}
	request.UpdatedAt = time.Now().UTC()

	for index, category := range mockAdminProductCategories {
		if category.ID == request.ID {
			mockAdminProductCategories[index] = request
			c.JSON(http.StatusOK, request)
			return
		}
	}

	mockAdminProductCategories = append(mockAdminProductCategories, request)
	c.JSON(http.StatusCreated, request)
}

func createAdminProductCategory(id string, name string, productType string, description string, productCount int) models.AdminProductCategory {
	return models.AdminProductCategory{
		ID:           id,
		Name:         name,
		Slug:         slugifyAdminProduct(name),
		Type:         productType,
		Description:  description,
		ProductCount: productCount,
		Status:       "active",
		UpdatedAt:    time.Now().UTC().Add(-time.Duration(productCount) * 12 * time.Hour),
	}
}

func createAdminProduct(product models.AdminProduct, updatedHoursAgo int) models.AdminProduct {
	product.UpdatedAt = time.Now().UTC().Add(-time.Duration(updatedHoursAgo) * time.Hour)
	product.CreatedAt = product.UpdatedAt.Add(-120 * time.Hour)
	normalizeAdminProduct(&product)
	if len(product.Conversions) == 0 {
		product.Conversions = buildAdminProductConversions(product)
	}
	return product
}

func normalizeAdminProduct(product *models.AdminProduct) {
	if product.Type == "" {
		product.Type = "affiliate"
	}
	if product.Slug == "" {
		product.Slug = slugifyAdminProduct(product.Name)
	}
	if product.Currency == "" {
		product.Currency = "USD"
	}
	if product.Status == "" {
		product.Status = "draft"
	}
	if product.GalleryImages == nil {
		product.GalleryImages = []string{}
	}
	if product.Variants == nil {
		product.Variants = []models.AdminProductVariant{}
	}
	if product.Conversions == nil {
		product.Conversions = []models.AdminProductConversion{}
	}
	if product.Type != "merch" {
		product.SKU = ""
		product.InventoryQuantity = nil
		product.LowStockThreshold = nil
		product.Variants = []models.AdminProductVariant{}
	}
	if product.Type == "merch" && product.InventoryQuantity == nil {
		product.InventoryQuantity = intPointer(0)
	}
	if product.Type == "merch" && product.LowStockThreshold == nil {
		product.LowStockThreshold = intPointer(10)
	}
	if product.CategoryName == "" {
		product.CategoryName = categoryNameByID(product.CategoryID)
	}
}

func buildAdminProductConversions(product models.AdminProduct) []models.AdminProductConversion {
	return []models.AdminProductConversion{
		{
			ID:                    product.ID + "-conv-week",
			ProductID:             product.ID,
			Source:                "affiliate_conversion",
			Label:                 "Last 7 days",
			Clicks:                int(float64(product.ClickCount) * 0.28),
			Conversions:           int(float64(product.ConversionCount) * 0.26),
			EstimatedContribution: product.EstimatedContribution * 0.25,
			OccurredAt:            time.Now().UTC().Add(-48 * time.Hour),
		},
		{
			ID:                    product.ID + "-conv-month",
			ProductID:             product.ID,
			Source:                "affiliate_click",
			Label:                 "Last 30 days",
			Clicks:                int(float64(product.ClickCount) * 0.72),
			Conversions:           int(float64(product.ConversionCount) * 0.68),
			EstimatedContribution: product.EstimatedContribution * 0.7,
			OccurredAt:            time.Now().UTC().Add(-15 * 24 * time.Hour),
		},
	}
}

func filterAdminProducts(products []models.AdminProduct, productType string) []models.AdminProduct {
	filtered := make([]models.AdminProduct, 0, len(products))
	for _, product := range products {
		if productType != "" && productType != "all" && product.Type != productType {
			continue
		}
		filtered = append(filtered, product)
	}
	return filtered
}

func summarizeAdminProducts(products []models.AdminProduct) models.AdminProductSummary {
	summary := models.AdminProductSummary{}
	for _, product := range products {
		summary.TotalCount++
		switch product.Status {
		case "published":
			summary.PublishedCount++
		case "draft":
			summary.DraftCount++
		case "archived":
			summary.ArchivedCount++
		}
		if product.Featured {
			summary.FeaturedCount++
		}
		if isAdminProductLowStock(product) {
			summary.LowStockCount++
		}
		summary.ClickCount += product.ClickCount
		summary.ConversionCount += product.ConversionCount
		summary.EstimatedContribution += product.EstimatedContribution
	}
	return summary
}

func isAdminProductLowStock(product models.AdminProduct) bool {
	if product.Type != "merch" || product.InventoryQuantity == nil {
		return false
	}
	threshold := 10
	if product.LowStockThreshold != nil {
		threshold = *product.LowStockThreshold
	}
	return *product.InventoryQuantity > 0 && *product.InventoryQuantity <= threshold
}

func adminProductCategoriesWithCounts() []models.AdminProductCategory {
	categories := make([]models.AdminProductCategory, len(mockAdminProductCategories))
	copy(categories, mockAdminProductCategories)
	counts := map[string]int{}

	for _, product := range mockAdminProducts {
		counts[product.CategoryID]++
	}
	for index := range categories {
		categories[index].ProductCount = counts[categories[index].ID]
	}

	sort.SliceStable(categories, func(i, j int) bool {
		return categories[i].Name < categories[j].Name
	})
	return categories
}

func categoryNameByID(id string) string {
	for _, category := range mockAdminProductCategories {
		if category.ID == id {
			return category.Name
		}
	}
	return "Uncategorized"
}

func findAdminProductIndex(id string) int {
	for index, product := range mockAdminProducts {
		if product.ID == id || product.Slug == id {
			return index
		}
	}
	return -1
}

func slugifyAdminProduct(value string) string {
	parts := strings.FieldsFunc(strings.ToLower(value), func(r rune) bool {
		return !(r >= 'a' && r <= 'z') && !(r >= '0' && r <= '9')
	})
	return strings.Join(parts, "-")
}

func intPointer(value int) *int {
	return &value
}
