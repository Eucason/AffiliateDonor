import apiClient from '@/lib/apiClient'
import type {
  AdminProduct,
  AdminProductCategory,
  AdminProductFormData,
  AdminProductListResponse,
  AdminProductStatus,
  AdminProductSummary,
  AdminProductType,
  AdminProductVariant,
} from '@/types/adminProduct'

const fallbackProductsKey = 'affiliateDonor.adminProducts'
const fallbackCategoriesKey = 'affiliateDonor.adminProductCategories'
const fallbackDeletedProductsKey = 'affiliateDonor.adminDeletedProducts'
const now = Date.now()

const mockCategories: AdminProductCategory[] = [
  createCategory('cat-home', 'Home & Lifestyle', 'affiliate', 3),
  createCategory('cat-fashion', 'Ethical Fashion', 'all', 2),
  createCategory('cat-tech', 'Sustainable Tech', 'affiliate', 1),
  createCategory('cat-merch', 'AffiliateDonor Merch', 'merch', 3),
]

const mockProducts: AdminProduct[] = [
  createProduct({
    id: 'p1',
    type: 'affiliate',
    name: 'Eco-Friendly Water Bottle',
    slug: 'eco-friendly-water-bottle',
    brand: 'EcoLife',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=900',
    galleryImages: ['https://images.unsplash.com/photo-1523362628745-0c100150b504?w=900'],
    categoryId: 'cat-home',
    categoryName: 'Home & Lifestyle',
    affiliateUrl: 'https://example.com/affiliate/eco-bottle',
    linkedCauseId: 'clean-water',
    linkedCauseName: 'Clean Water Initiative',
    allocationPercent: 10,
    description: 'Durable stainless steel bottle with affiliate proceeds supporting clean water campaigns.',
    status: 'published',
    featured: true,
    clickCount: 1324,
    conversionCount: 86,
    estimatedContribution: 2140,
    updatedHoursAgo: 5,
  }),
  createProduct({
    id: 'p2',
    type: 'affiliate',
    name: 'Solar Power Bank',
    slug: 'solar-power-bank',
    brand: 'SunCharge',
    price: 54.95,
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900',
    galleryImages: [],
    categoryId: 'cat-tech',
    categoryName: 'Sustainable Tech',
    affiliateUrl: 'https://example.com/affiliate/solar-bank',
    linkedCauseId: 'climate-action',
    linkedCauseName: 'Climate Action',
    allocationPercent: 12,
    description: 'Portable solar charging bank for travel and emergency kits.',
    status: 'published',
    featured: false,
    clickCount: 788,
    conversionCount: 44,
    estimatedContribution: 1630,
    updatedHoursAgo: 28,
  }),
  createProduct({
    id: 'p3',
    type: 'affiliate',
    name: 'Organic Cotton Tote',
    slug: 'organic-cotton-tote',
    brand: 'GreenThread',
    price: 18.5,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900',
    galleryImages: [],
    categoryId: 'cat-fashion',
    categoryName: 'Ethical Fashion',
    affiliateUrl: 'https://example.com/affiliate/cotton-tote',
    linkedCauseId: 'education-for-all',
    linkedCauseName: 'Education for All',
    allocationPercent: 8,
    description: 'Reusable organic cotton tote for everyday shopping.',
    status: 'draft',
    featured: false,
    clickCount: 142,
    conversionCount: 0,
    estimatedContribution: 0,
    updatedHoursAgo: 64,
  }),
  createProduct({
    id: 'merch-1',
    type: 'merch',
    name: 'AffiliateDonor T-Shirt',
    slug: 'affiliatedonor-t-shirt',
    brand: 'AffiliateDonor',
    sku: 'AD-TEE-001',
    price: 32,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900',
    galleryImages: ['https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=900'],
    categoryId: 'cat-merch',
    categoryName: 'AffiliateDonor Merch',
    linkedCauseId: 'education-for-all',
    linkedCauseName: 'Education for All',
    allocationPercent: 35,
    description: 'Soft organic cotton shirt with net proceeds allocated to education campaigns.',
    status: 'published',
    featured: true,
    clickCount: 942,
    conversionCount: 117,
    estimatedContribution: 2925,
    inventoryQuantity: 184,
    lowStockThreshold: 30,
    variants: [
      { id: 'tee-s', name: 'Small', sku: 'AD-TEE-S', inventoryQuantity: 48 },
      { id: 'tee-m', name: 'Medium', sku: 'AD-TEE-M', inventoryQuantity: 71 },
      { id: 'tee-l', name: 'Large', sku: 'AD-TEE-L', inventoryQuantity: 65 },
    ],
    updatedHoursAgo: 9,
  }),
  createProduct({
    id: 'merch-2',
    type: 'merch',
    name: 'Impact Hoodie',
    slug: 'impact-hoodie',
    brand: 'AffiliateDonor',
    sku: 'AD-HOOD-001',
    price: 68,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900',
    galleryImages: [],
    categoryId: 'cat-merch',
    categoryName: 'AffiliateDonor Merch',
    linkedCauseId: 'hunger-relief',
    linkedCauseName: 'Hunger Relief',
    allocationPercent: 30,
    description: 'Midweight hoodie with profit allocation toward hunger relief logistics.',
    status: 'published',
    featured: false,
    clickCount: 391,
    conversionCount: 26,
    estimatedContribution: 530,
    inventoryQuantity: 12,
    lowStockThreshold: 20,
    variants: [
      { id: 'hood-m', name: 'Medium', sku: 'AD-HOOD-M', inventoryQuantity: 4 },
      { id: 'hood-l', name: 'Large', sku: 'AD-HOOD-L', inventoryQuantity: 8 },
    ],
    updatedHoursAgo: 16,
  }),
  createProduct({
    id: 'merch-3',
    type: 'merch',
    name: 'Donor Sticker Pack',
    slug: 'donor-sticker-pack',
    brand: 'AffiliateDonor',
    sku: 'AD-STICK-001',
    price: 8,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900',
    galleryImages: [],
    categoryId: 'cat-merch',
    categoryName: 'AffiliateDonor Merch',
    linkedCauseId: 'clean-water',
    linkedCauseName: 'Clean Water Initiative',
    allocationPercent: 40,
    description: 'Sticker set for donors and campaign ambassadors.',
    status: 'archived',
    featured: false,
    clickCount: 121,
    conversionCount: 18,
    estimatedContribution: 58,
    inventoryQuantity: 0,
    lowStockThreshold: 25,
    variants: [],
    updatedHoursAgo: 92,
  }),
]

export const adminProductsAPI = {
  async getProducts(type?: AdminProductType): Promise<AdminProductListResponse> {
    try {
      const response = await apiClient.get<AdminProductListResponse>('/api/admin/products', {
        params: { type },
      })
      saveAllProducts(mergeProducts(readStoredProducts(), response.data.products))
      saveAllCategories(mergeCategories(readStoredCategories(), response.data.categories))
      return response.data
    } catch (error) {
      console.warn('Using admin products fallback data because the API could not be reached.', error)
      const products = filterByType(getFallbackProducts(), type)
      const categories = getFallbackCategories()
      return {
        products,
        categories,
        summary: summarizeProducts(products),
      }
    }
  },

  async getProduct(id: string): Promise<AdminProduct> {
    try {
      const response = await apiClient.get<AdminProduct>(`/api/admin/products/${id}`)
      saveFallbackProduct(response.data)
      return response.data
    } catch (error) {
      console.warn('Using admin product fallback detail because the API could not be reached.', error)
      const product = getFallbackProducts().find((item) => item.id === id || item.slug === id)
      if (!product) {
        throw new Error('Product not found.')
      }
      return product
    }
  },

  async createProduct(formData: AdminProductFormData): Promise<AdminProduct> {
    const product = formDataToProduct(formData)
    try {
      const response = await apiClient.post<AdminProduct>('/api/admin/products', product)
      saveFallbackProduct(response.data)
      return response.data
    } catch (error) {
      console.warn('Saving product in fallback admin storage because the API could not be reached.', error)
      saveFallbackProduct(product)
      return product
    }
  },

  async updateProduct(id: string, formData: AdminProductFormData): Promise<AdminProduct> {
    const current = await this.getProduct(id)
    const product = formDataToProduct(formData, current)
    try {
      const response = await apiClient.put<AdminProduct>(`/api/admin/products/${id}`, product)
      saveFallbackProduct(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating product in fallback admin storage because the API could not be reached.', error)
      saveFallbackProduct(product)
      return product
    }
  },

  async updateStatus(id: string, status: AdminProductStatus): Promise<AdminProduct> {
    const current = await this.getProduct(id)
    const updated = { ...current, status, updatedAt: new Date().toISOString() }
    try {
      const response = await apiClient.patch<AdminProduct>(`/api/admin/products/${id}/status`, { status })
      saveFallbackProduct(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating product status in fallback admin storage because the API could not be reached.', error)
      saveFallbackProduct(updated)
      return updated
    }
  },

  async updateInventory(id: string, inventoryQuantity: number): Promise<AdminProduct> {
    const current = await this.getProduct(id)
    const updated = { ...current, inventoryQuantity, updatedAt: new Date().toISOString() }
    try {
      const response = await apiClient.patch<AdminProduct>(`/api/admin/products/${id}/inventory`, { inventoryQuantity })
      saveFallbackProduct(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating inventory in fallback admin storage because the API could not be reached.', error)
      saveFallbackProduct(updated)
      return updated
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/admin/products/${id}`)
    } catch (error) {
      console.warn('Deleting product in fallback admin storage because the API could not be reached.', error)
    }
    markFallbackProductDeleted(id)
  },

  async saveCategory(category: AdminProductCategory): Promise<AdminProductCategory> {
    const updated = { ...category, updatedAt: new Date().toISOString() }
    try {
      const response = await apiClient.put<AdminProductCategory>(`/api/admin/products/categories/${updated.id}`, updated)
      saveAllCategories(mergeCategories(getFallbackCategories(), [response.data]))
      return response.data
    } catch (error) {
      console.warn('Saving product category in fallback admin storage because the API could not be reached.', error)
      const categories = getFallbackCategories()
      saveAllCategories([...categories.filter((item) => item.id !== updated.id), updated])
      return updated
    }
  },
}

export function summarizeProducts(products: AdminProduct[]): AdminProductSummary {
  return products.reduce<AdminProductSummary>(
    (summary, product) => {
      summary.totalCount += 1
      summary.publishedCount += product.status === 'published' ? 1 : 0
      summary.draftCount += product.status === 'draft' ? 1 : 0
      summary.archivedCount += product.status === 'archived' ? 1 : 0
      summary.featuredCount += product.featured ? 1 : 0
      summary.lowStockCount += isLowStock(product) ? 1 : 0
      summary.clickCount += product.clickCount
      summary.conversionCount += product.conversionCount
      summary.estimatedContribution += product.estimatedContribution
      return summary
    },
    {
      totalCount: 0,
      publishedCount: 0,
      draftCount: 0,
      archivedCount: 0,
      featuredCount: 0,
      lowStockCount: 0,
      clickCount: 0,
      conversionCount: 0,
      estimatedContribution: 0,
    },
  )
}

export function productToFormData(product: AdminProduct): AdminProductFormData {
  return {
    type: product.type,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    sku: product.sku ?? '',
    price: String(product.price),
    currency: product.currency,
    imageUrl: product.imageUrl,
    galleryImages: product.galleryImages.join('\n'),
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    affiliateUrl: product.affiliateUrl ?? '',
    linkedCauseId: product.linkedCauseId,
    linkedCauseName: product.linkedCauseName,
    allocationPercent: String(product.allocationPercent),
    description: product.description,
    status: product.status,
    featured: product.featured,
    inventoryQuantity: product.inventoryQuantity === undefined ? '' : String(product.inventoryQuantity),
    lowStockThreshold: product.lowStockThreshold === undefined ? '' : String(product.lowStockThreshold),
    variants: product.variants.map((variant) => `${variant.name}|${variant.sku}|${variant.inventoryQuantity}`).join('\n'),
  }
}

export function emptyProductFormData(type: AdminProductType = 'affiliate'): AdminProductFormData {
  return {
    type,
    name: '',
    slug: '',
    brand: type === 'merch' ? 'AffiliateDonor' : '',
    sku: '',
    price: '',
    currency: 'USD',
    imageUrl: '',
    galleryImages: '',
    categoryId: type === 'merch' ? 'cat-merch' : 'cat-home',
    categoryName: type === 'merch' ? 'AffiliateDonor Merch' : 'Home & Lifestyle',
    affiliateUrl: '',
    linkedCauseId: 'clean-water',
    linkedCauseName: 'Clean Water Initiative',
    allocationPercent: type === 'merch' ? '30' : '10',
    description: '',
    status: 'draft',
    featured: false,
    inventoryQuantity: type === 'merch' ? '0' : '',
    lowStockThreshold: type === 'merch' ? '10' : '',
    variants: '',
  }
}

export function generateProductSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isLowStock(product: AdminProduct) {
  if (product.type !== 'merch' || product.inventoryQuantity === undefined) {
    return false
  }
  return product.inventoryQuantity > 0 && product.inventoryQuantity <= (product.lowStockThreshold ?? 10)
}

export function isOutOfStock(product: AdminProduct) {
  return product.type === 'merch' && product.inventoryQuantity !== undefined && product.inventoryQuantity <= 0
}

function createCategory(id: string, name: string, type: AdminProductCategory['type'], productCount: number): AdminProductCategory {
  return {
    id,
    name,
    slug: generateProductSlug(name),
    type,
    description: `${name} product category.`,
    productCount,
    status: 'active',
    updatedAt: new Date(now - productCount * 12 * 60 * 60 * 1000).toISOString(),
  }
}

function createProduct(
  product: Omit<AdminProduct, 'currency' | 'conversions' | 'createdAt' | 'updatedAt' | 'variants'> & {
    variants?: AdminProductVariant[]
    updatedHoursAgo: number
  },
): AdminProduct {
  const updatedAt = new Date(now - product.updatedHoursAgo * 60 * 60 * 1000).toISOString()
  return {
    ...product,
    currency: 'USD',
    variants: product.variants ?? [],
    createdAt: new Date(now - (product.updatedHoursAgo + 120) * 60 * 60 * 1000).toISOString(),
    updatedAt,
    conversions: buildConversions(product.id, product.clickCount, product.conversionCount, product.estimatedContribution),
  }
}

function buildConversions(productId: string, clicks: number, conversions: number, contribution: number) {
  return [
    {
      id: `${productId}-conv-week`,
      productId,
      source: 'affiliate_conversion' as const,
      label: 'Last 7 days',
      clicks: Math.round(clicks * 0.28),
      conversions: Math.round(conversions * 0.26),
      estimatedContribution: Math.round(contribution * 0.25),
      occurredAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: `${productId}-conv-month`,
      productId,
      source: 'affiliate_click' as const,
      label: 'Last 30 days',
      clicks: Math.round(clicks * 0.72),
      conversions: Math.round(conversions * 0.68),
      estimatedContribution: Math.round(contribution * 0.7),
      occurredAt: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

function formDataToProduct(formData: AdminProductFormData, existing?: AdminProduct): AdminProduct {
  const timestamp = new Date().toISOString()
  const galleryImages = formData.galleryImages
    .split('\n')
    .map((image) => image.trim())
    .filter(Boolean)
  const variants = parseVariants(formData.variants)

  return {
    id: existing?.id ?? `prod-${Date.now()}`,
    type: formData.type,
    name: formData.name.trim(),
    slug: formData.slug.trim() || generateProductSlug(formData.name),
    brand: formData.brand.trim(),
    sku: formData.type === 'merch' ? formData.sku.trim() : undefined,
    price: Number(formData.price) || 0,
    currency: formData.currency || 'USD',
    imageUrl: formData.imageUrl.trim(),
    galleryImages,
    categoryId: formData.categoryId,
    categoryName: formData.categoryName.trim(),
    affiliateUrl: formData.type === 'affiliate' ? formData.affiliateUrl.trim() : undefined,
    linkedCauseId: formData.linkedCauseId.trim(),
    linkedCauseName: formData.linkedCauseName.trim(),
    allocationPercent: Number(formData.allocationPercent) || 0,
    description: formData.description.trim(),
    status: formData.status,
    featured: formData.featured,
    clickCount: existing?.clickCount ?? 0,
    conversionCount: existing?.conversionCount ?? 0,
    estimatedContribution: existing?.estimatedContribution ?? 0,
    inventoryQuantity: formData.type === 'merch' ? Number(formData.inventoryQuantity) || 0 : undefined,
    lowStockThreshold: formData.type === 'merch' ? Number(formData.lowStockThreshold) || 10 : undefined,
    variants,
    conversions: existing?.conversions ?? [],
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
}

function parseVariants(value: string): AdminProductVariant[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [name, sku, inventory] = line.split('|').map((part) => part?.trim() ?? '')
      return {
        id: `variant-${index + 1}`,
        name: name || `Variant ${index + 1}`,
        sku: sku || `SKU-${index + 1}`,
        inventoryQuantity: Number(inventory) || 0,
      }
    })
}

function filterByType(products: AdminProduct[], type?: AdminProductType) {
  return type ? products.filter((product) => product.type === type) : products
}

function getFallbackProducts() {
  const deletedIds = readDeletedProductIds()
  const products = mergeProducts(mockProducts, readStoredProducts())
  return products.filter((product) => !deletedIds.has(product.id))
}

function getFallbackCategories() {
  return mergeCategories(mockCategories, readStoredCategories())
}

function saveFallbackProduct(product: AdminProduct) {
  unmarkFallbackProductDeleted(product.id)
  saveAllProducts(mergeProducts(readStoredProducts(), [product]))
}

function saveAllProducts(products: AdminProduct[]) {
  if (typeof window === 'undefined') {
    return
  }
  const deletedIds = readDeletedProductIds()
  window.localStorage.setItem(
    fallbackProductsKey,
    JSON.stringify(products.filter((product) => !deletedIds.has(product.id))),
  )
}

function saveAllCategories(categories: AdminProductCategory[]) {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(fallbackCategoriesKey, JSON.stringify(categories))
}

function readStoredProducts(): AdminProduct[] {
  if (typeof window === 'undefined') {
    return []
  }
  try {
    const value = window.localStorage.getItem(fallbackProductsKey)
    return value ? (JSON.parse(value) as AdminProduct[]) : []
  } catch (error) {
    console.warn('Stored admin products could not be parsed.', error)
    return []
  }
}

function readDeletedProductIds() {
  if (typeof window === 'undefined') {
    return new Set<string>()
  }
  try {
    const value = window.localStorage.getItem(fallbackDeletedProductsKey)
    return new Set(value ? (JSON.parse(value) as string[]) : [])
  } catch (error) {
    console.warn('Stored deleted admin product ids could not be parsed.', error)
    return new Set<string>()
  }
}

function writeDeletedProductIds(ids: Set<string>) {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(fallbackDeletedProductsKey, JSON.stringify(Array.from(ids)))
}

function markFallbackProductDeleted(id: string) {
  const deletedIds = readDeletedProductIds()
  deletedIds.add(id)
  writeDeletedProductIds(deletedIds)
  saveAllProducts(readStoredProducts().filter((product) => product.id !== id))
}

function unmarkFallbackProductDeleted(id: string) {
  const deletedIds = readDeletedProductIds()
  if (!deletedIds.has(id)) {
    return
  }
  deletedIds.delete(id)
  writeDeletedProductIds(deletedIds)
}

function readStoredCategories(): AdminProductCategory[] {
  if (typeof window === 'undefined') {
    return []
  }
  try {
    const value = window.localStorage.getItem(fallbackCategoriesKey)
    return value ? (JSON.parse(value) as AdminProductCategory[]) : []
  } catch (error) {
    console.warn('Stored admin product categories could not be parsed.', error)
    return []
  }
}

function mergeProducts(base: AdminProduct[], overrides: AdminProduct[]) {
  const byId = new Map<string, AdminProduct>()
  base.forEach((product) => byId.set(product.id, product))
  overrides.forEach((product) => byId.set(product.id, product))
  return Array.from(byId.values())
}

function mergeCategories(base: AdminProductCategory[], overrides: AdminProductCategory[]) {
  const byId = new Map<string, AdminProductCategory>()
  base.forEach((category) => byId.set(category.id, category))
  overrides.forEach((category) => byId.set(category.id, category))
  return Array.from(byId.values())
}
