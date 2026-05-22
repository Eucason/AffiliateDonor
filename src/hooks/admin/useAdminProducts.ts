import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminProductsAPI,
  isLowStock,
  isOutOfStock,
  summarizeProducts,
} from '@/services/admin/adminProductsAPI'
import type {
  AdminProduct,
  AdminProductFilterOptions,
  AdminProductFilters,
  AdminProductType,
} from '@/types/adminProduct'

export const defaultAdminProductFilters: AdminProductFilters = {
  search: '',
  type: 'all',
  category: 'all',
  status: 'all',
  featured: 'all',
  cause: 'all',
  inventoryState: 'all',
  conversionState: 'all',
  sort: 'newest',
}

export function useAdminProducts(type?: AdminProductType) {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [filters, setFilters] = useState<AdminProductFilters>({
    ...defaultAdminProductFilters,
    type: type ?? 'all',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<AdminProductFilterOptions['categories']>([])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminProductsAPI.getProducts(type)
      setProducts(response.products)
      setCategories(response.categories)
    } catch (requestError) {
      console.error('Failed to load admin products:', requestError)
      setError('Products could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = useMemo(
    () => sortProducts(products.filter((product) => productMatchesFilters(product, filters)), filters),
    [products, filters],
  )
  const summary = useMemo(() => summarizeProducts(filteredProducts), [filteredProducts])
  const filterOptions = useMemo<AdminProductFilterOptions>(
    () => ({
      categories,
      causes: uniqueSorted(products.map((product) => product.linkedCauseName)),
      statuses: uniqueSorted(products.map((product) => product.status)),
    }),
    [categories, products],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminProductFilters>(key: Key, value: AdminProductFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters({ ...defaultAdminProductFilters, type: type ?? 'all' })
  }, [type])

  const replaceProduct = useCallback((updatedProduct: AdminProduct) => {
    setProducts((current) => current.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
  }, [])

  const removeProduct = useCallback((id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id))
  }, [])

  return {
    products,
    filteredProducts,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch: fetchProducts,
    updateFilter,
    clearFilters,
    replaceProduct,
    removeProduct,
  }
}

function productMatchesFilters(product: AdminProduct, filters: AdminProductFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    product.name,
    product.brand,
    product.sku ?? '',
    product.categoryName,
    product.linkedCauseName,
    product.affiliateUrl ?? '',
    product.status,
    product.description,
  ]
    .join(' ')
    .toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }
  if (filters.type !== 'all' && product.type !== filters.type) {
    return false
  }
  if (filters.category !== 'all' && product.categoryId !== filters.category) {
    return false
  }
  if (filters.status !== 'all' && product.status !== filters.status) {
    return false
  }
  if (filters.featured === 'featured' && !product.featured) {
    return false
  }
  if (filters.featured === 'standard' && product.featured) {
    return false
  }
  if (filters.cause !== 'all' && product.linkedCauseName !== filters.cause) {
    return false
  }
  if (filters.conversionState === 'has_conversions' && product.conversionCount <= 0) {
    return false
  }
  if (filters.conversionState === 'no_conversions' && product.conversionCount > 0) {
    return false
  }
  if (!matchesInventory(product, filters.inventoryState)) {
    return false
  }
  return true
}

function matchesInventory(product: AdminProduct, inventoryState: AdminProductFilters['inventoryState']) {
  switch (inventoryState) {
    case 'in_stock':
      return product.type === 'merch' && (product.inventoryQuantity ?? 0) > 0 && !isLowStock(product)
    case 'low_stock':
      return isLowStock(product)
    case 'out_of_stock':
      return isOutOfStock(product)
    case 'not_tracked':
      return product.type === 'affiliate'
    case 'all':
    default:
      return true
  }
}

function sortProducts(products: AdminProduct[], filters: AdminProductFilters) {
  return [...products].sort((first, second) => {
    switch (filters.sort) {
      case 'oldest':
        return new Date(first.updatedAt).getTime() - new Date(second.updatedAt).getTime()
      case 'name':
        return first.name.localeCompare(second.name)
      case 'price_desc':
        return second.price - first.price
      case 'contribution_desc':
        return second.estimatedContribution - first.estimatedContribution
      case 'inventory_asc':
        return (first.inventoryQuantity ?? Number.MAX_SAFE_INTEGER) - (second.inventoryQuantity ?? Number.MAX_SAFE_INTEGER)
      case 'newest':
      default:
        return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
    }
  })
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}
