export type AdminProductType = 'affiliate' | 'merch'
export type AdminProductStatus = 'draft' | 'published' | 'archived' | 'disabled'
export type AdminProductSort = 'newest' | 'oldest' | 'name' | 'price_desc' | 'contribution_desc' | 'inventory_asc'
export type AdminInventoryState = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'not_tracked'
export type AdminConversionState = 'all' | 'has_conversions' | 'no_conversions'

export interface AdminProductVariant {
  id: string
  name: string
  sku: string
  inventoryQuantity: number
  price?: number
}

export interface AdminProductConversion {
  id: string
  productId: string
  source: 'affiliate_click' | 'affiliate_conversion' | 'merch_purchase'
  label: string
  clicks: number
  conversions: number
  estimatedContribution: number
  occurredAt: string
}

export interface AdminProduct {
  id: string
  type: AdminProductType
  name: string
  slug: string
  brand: string
  sku?: string
  price: number
  currency: string
  imageUrl: string
  galleryImages: string[]
  categoryId: string
  categoryName: string
  affiliateUrl?: string
  linkedCauseId: string
  linkedCauseName: string
  allocationPercent: number
  description: string
  status: AdminProductStatus
  featured: boolean
  clickCount: number
  conversionCount: number
  estimatedContribution: number
  inventoryQuantity?: number
  lowStockThreshold?: number
  variants: AdminProductVariant[]
  conversions: AdminProductConversion[]
  createdAt: string
  updatedAt: string
}

export interface AdminProductCategory {
  id: string
  name: string
  slug: string
  type: AdminProductType | 'all'
  description: string
  productCount: number
  status: 'active' | 'archived'
  updatedAt: string
}

export interface AdminProductSummary {
  totalCount: number
  publishedCount: number
  draftCount: number
  archivedCount: number
  featuredCount: number
  lowStockCount: number
  clickCount: number
  conversionCount: number
  estimatedContribution: number
}

export interface AdminProductListResponse {
  products: AdminProduct[]
  categories: AdminProductCategory[]
  summary: AdminProductSummary
}

export interface AdminProductFilters {
  search: string
  type: AdminProductType | 'all'
  category: string
  status: AdminProductStatus | 'all'
  featured: 'all' | 'featured' | 'standard'
  cause: string
  inventoryState: AdminInventoryState
  conversionState: AdminConversionState
  sort: AdminProductSort
}

export interface AdminProductFilterOptions {
  categories: AdminProductCategory[]
  causes: string[]
  statuses: AdminProductStatus[]
}

export interface AdminProductFormData {
  type: AdminProductType
  name: string
  slug: string
  brand: string
  sku: string
  price: string
  currency: string
  imageUrl: string
  galleryImages: string
  categoryId: string
  categoryName: string
  affiliateUrl: string
  linkedCauseId: string
  linkedCauseName: string
  allocationPercent: string
  description: string
  status: AdminProductStatus
  featured: boolean
  inventoryQuantity: string
  lowStockThreshold: string
  variants: string
}
