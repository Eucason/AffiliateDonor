import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminContentAPI, summarizeContent } from '@/services/admin/adminContentAPI'
import type {
  AdminContentArea,
  AdminContentBlock,
  AdminContentFilterOptions,
  AdminContentFilters,
} from '@/types/adminContent'

export const defaultAdminContentFilters: AdminContentFilters = {
  search: '',
  area: 'all',
  type: 'all',
  status: 'all',
  scheduled: 'all',
  updatedFrom: '',
  updatedTo: '',
  sort: 'order',
}

export function useAdminContent(area?: AdminContentArea) {
  const [blocks, setBlocks] = useState<AdminContentBlock[]>([])
  const [filters, setFilters] = useState<AdminContentFilters>({
    ...defaultAdminContentFilters,
    area: area ?? 'all',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminContentAPI.getContentBlocks(area)
      setBlocks(response.blocks)
    } catch (requestError) {
      console.error('Failed to load admin content:', requestError)
      setError('Website content could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [area])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const filteredBlocks = useMemo(() => sortBlocks(blocks.filter((block) => blockMatchesFilters(block, filters)), filters), [blocks, filters])
  const summary = useMemo(() => summarizeContent(filteredBlocks), [filteredBlocks])
  const filterOptions = useMemo<AdminContentFilterOptions>(
    () => ({
      areas: uniqueSorted(blocks.map((block) => block.area)),
      types: uniqueSorted(blocks.map((block) => block.type)),
      statuses: uniqueSorted(blocks.map((block) => block.status)),
    }),
    [blocks],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminContentFilters>(key: Key, value: AdminContentFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters({ ...defaultAdminContentFilters, area: area ?? 'all' })
  }, [area])

  const replaceBlock = useCallback((updatedBlock: AdminContentBlock) => {
    setBlocks((current) => current.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)))
  }, [])

  return {
    blocks,
    filteredBlocks,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch: fetchContent,
    updateFilter,
    clearFilters,
    replaceBlock,
  }
}

function blockMatchesFilters(block: AdminContentBlock, filters: AdminContentFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    block.title,
    block.slug,
    block.area,
    block.type,
    block.status,
    block.summary,
    block.body,
    block.linkedEntityLabel ?? '',
  ]
    .join(' ')
    .toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }
  if (filters.area !== 'all' && block.area !== filters.area) {
    return false
  }
  if (filters.type !== 'all' && block.type !== filters.type) {
    return false
  }
  if (filters.status !== 'all' && block.status !== filters.status) {
    return false
  }
  if (filters.scheduled === 'scheduled' && !block.scheduledAt) {
    return false
  }
  if (filters.scheduled === 'unscheduled' && block.scheduledAt) {
    return false
  }
  if (filters.updatedFrom && new Date(block.updatedAt) < new Date(filters.updatedFrom)) {
    return false
  }
  if (filters.updatedTo) {
    const toDate = new Date(filters.updatedTo)
    toDate.setHours(23, 59, 59, 999)
    if (new Date(block.updatedAt) > toDate) {
      return false
    }
  }
  return true
}

function sortBlocks(blocks: AdminContentBlock[], filters: AdminContentFilters) {
  return [...blocks].sort((first, second) => {
    switch (filters.sort) {
      case 'oldest':
        return new Date(first.updatedAt).getTime() - new Date(second.updatedAt).getTime()
      case 'title':
        return first.title.localeCompare(second.title)
      case 'status':
        return first.status.localeCompare(second.status)
      case 'newest':
        return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      case 'order':
      default:
        if (first.area === second.area) {
          return first.sortOrder - second.sortOrder
        }
        return first.area.localeCompare(second.area)
    }
  })
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}
