import { adminProductsAPI } from '@/services/admin/adminProductsAPI'
import type { AdminProduct, AdminProductType } from '@/types/adminProduct'

export interface PublicProduct {
  id: string
  type: AdminProductType
  name: string
  brand: string
  price: number
  currency: string
  image: string
  category: string
  causeId: string
  causeName: string
  donationPercent: number
  description: string
  affiliateLink?: string
  inventoryQuantity?: number
  lowStockThreshold?: number
  featured: boolean
}

export const productCatalogAPI = {
  async getPublishedProducts(type?: AdminProductType): Promise<PublicProduct[]> {
    const response = await adminProductsAPI.getProducts(type)
    return response.products
      .filter((product) => product.status === 'published')
      .sort(sortPublicProducts)
      .map(mapAdminProductToPublic)
  },
}

export function mapAdminProductToPublic(product: AdminProduct): PublicProduct {
  return {
    id: product.id,
    type: product.type,
    name: product.name,
    brand: product.brand,
    price: product.price,
    currency: product.currency,
    image: product.imageUrl,
    category: product.categoryName,
    causeId: product.linkedCauseId,
    causeName: product.linkedCauseName,
    donationPercent: product.allocationPercent,
    description: product.description,
    affiliateLink: product.affiliateUrl,
    inventoryQuantity: product.inventoryQuantity,
    lowStockThreshold: product.lowStockThreshold,
    featured: product.featured,
  }
}

export function getPublicProductCategories(products: PublicProduct[]) {
  return ['All', ...Array.from(new Set(products.map((product) => product.category))).sort((first, second) => first.localeCompare(second))]
}

function sortPublicProducts(first: AdminProduct, second: AdminProduct) {
  if (first.featured !== second.featured) {
    return first.featured ? -1 : 1
  }
  return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
}
