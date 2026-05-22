import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminMediaAPI, assetNeedsAlt, summarizeMedia } from '@/services/admin/adminMediaAPI'
import type {
  AdminMediaAsset,
  AdminMediaFilterOptions,
  AdminMediaFilters,
  AdminMediaUsageArea,
} from '@/types/adminMedia'

export const defaultAdminMediaFilters: AdminMediaFilters = {
  search: '',
  type: 'all',
  usageArea: 'all',
  uploadedBy: '',
  missingAlt: 'all',
  dateFrom: '',
  dateTo: '',
  sort: 'newest',
}

export function useAdminMedia(initialFilters: Partial<AdminMediaFilters> = {}) {
  const [assets, setAssets] = useState<AdminMediaAsset[]>([])
  const [filters, setFilters] = useState<AdminMediaFilters>({
    ...defaultAdminMediaFilters,
    ...initialFilters,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminMediaAPI.getAssets()
      setAssets(response.assets)
    } catch (requestError) {
      console.error('Failed to load admin media assets:', requestError)
      setError('Media assets could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const filteredAssets = useMemo(() => sortAssets(assets.filter((asset) => assetMatchesFilters(asset, filters)), filters), [assets, filters])
  const summary = useMemo(() => summarizeMedia(filteredAssets), [filteredAssets])
  const filterOptions = useMemo<AdminMediaFilterOptions>(
    () => ({
      types: uniqueSorted(assets.map((asset) => asset.type)),
      usageAreas: uniqueSorted(
        assets.flatMap((asset) => (asset.usage.length ? asset.usage.map((usage) => usage.area) : ['unused' as const])),
      ),
      uploadedBy: uniqueSorted(assets.map((asset) => asset.uploadedBy)),
    }),
    [assets],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminMediaFilters>(key: Key, value: AdminMediaFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminMediaFilters)
  }, [])

  const replaceAsset = useCallback((updatedAsset: AdminMediaAsset) => {
    setAssets((current) => current.map((asset) => (asset.id === updatedAsset.id ? updatedAsset : asset)))
  }, [])

  const addAsset = useCallback((asset: AdminMediaAsset) => {
    setAssets((current) => [asset, ...current])
  }, [])

  const removeAsset = useCallback((id: string) => {
    setAssets((current) => current.filter((asset) => asset.id !== id))
  }, [])

  return {
    assets,
    filteredAssets,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch: fetchAssets,
    updateFilter,
    clearFilters,
    replaceAsset,
    addAsset,
    removeAsset,
  }
}

function assetMatchesFilters(asset: AdminMediaAsset, filters: AdminMediaFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    asset.title,
    asset.fileName,
    asset.url,
    asset.altText,
    asset.caption,
    asset.tags.join(' '),
    asset.uploadedBy,
    asset.usage.map((usage) => usage.label).join(' '),
  ]
    .join(' ')
    .toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }
  if (filters.type !== 'all' && asset.type !== filters.type) {
    return false
  }
  if (filters.usageArea !== 'all' && !assetMatchesUsage(asset, filters.usageArea)) {
    return false
  }
  if (filters.uploadedBy && asset.uploadedBy !== filters.uploadedBy) {
    return false
  }
  if (filters.missingAlt === 'missing' && (!assetNeedsAlt(asset) || asset.altText.trim())) {
    return false
  }
  if (filters.missingAlt === 'complete' && assetNeedsAlt(asset) && !asset.altText.trim()) {
    return false
  }
  if (filters.dateFrom && new Date(asset.uploadedAt) < new Date(filters.dateFrom)) {
    return false
  }
  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    if (new Date(asset.uploadedAt) > dateTo) {
      return false
    }
  }
  return true
}

function assetMatchesUsage(asset: AdminMediaAsset, usageArea: AdminMediaUsageArea) {
  if (usageArea === 'unused') {
    return asset.usage.length === 0
  }
  return asset.usage.some((usage) => usage.area === usageArea)
}

function sortAssets(assets: AdminMediaAsset[], filters: AdminMediaFilters) {
  return [...assets].sort((first, second) => {
    switch (filters.sort) {
      case 'oldest':
        return new Date(first.uploadedAt).getTime() - new Date(second.uploadedAt).getTime()
      case 'title':
        return first.title.localeCompare(second.title)
      case 'size_desc':
        return second.sizeBytes - first.sizeBytes
      case 'usage_desc':
        return second.usage.length - first.usage.length
      case 'newest':
      default:
        return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
    }
  })
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}
