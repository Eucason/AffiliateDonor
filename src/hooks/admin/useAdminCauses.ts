import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminCausesAPI, summarizeCauses } from '@/services/admin/adminCausesAPI'
import type {
  AdminCause,
  AdminCauseFilterOptions,
  AdminCauseFilters,
} from '@/types/adminCause'

export const defaultAdminCauseFilters: AdminCauseFilters = {
  search: '',
  status: 'all',
  category: 'all',
  featured: 'all',
  verified: 'all',
  dateFrom: '',
  dateTo: '',
  progressMin: '',
  progressMax: '',
  sort: 'newest',
}

export function useAdminCauses(initialFilters: Partial<AdminCauseFilters> = {}) {
  const [causes, setCauses] = useState<AdminCause[]>([])
  const [filters, setFilters] = useState<AdminCauseFilters>({
    ...defaultAdminCauseFilters,
    ...initialFilters,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCauses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminCausesAPI.getCauses()
      setCauses(response.causes)
    } catch (requestError) {
      console.error('Failed to load admin causes:', requestError)
      setError('Campaign records could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCauses()
  }, [fetchCauses])

  const filteredCauses = useMemo(() => {
    return sortCauses(causes.filter((cause) => causeMatchesFilters(cause, filters)), filters.sort)
  }, [causes, filters])

  const summary = useMemo(() => summarizeCauses(filteredCauses), [filteredCauses])

  const filterOptions = useMemo<AdminCauseFilterOptions>(
    () => ({
      categories: uniqueSorted(causes.map((cause) => cause.category)),
      statuses: uniqueSorted(causes.map((cause) => cause.status)),
    }),
    [causes],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminCauseFilters>(key: Key, value: AdminCauseFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminCauseFilters)
  }, [])

  const replaceCause = useCallback((updatedCause: AdminCause) => {
    setCauses((current) => current.map((cause) => (cause.id === updatedCause.id ? updatedCause : cause)))
  }, [])

  return {
    causes,
    filteredCauses,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch: fetchCauses,
    updateFilter,
    clearFilters,
    replaceCause,
  }
}

function causeMatchesFilters(cause: AdminCause, filters: AdminCauseFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    cause.id,
    cause.name,
    cause.slug,
    cause.category,
    cause.location,
    cause.description,
    cause.status,
  ]
    .join(' ')
    .toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }

  if (filters.status !== 'all' && cause.status !== filters.status) {
    return false
  }

  if (filters.category !== 'all' && !valueMatchesFilter(cause.category, filters.category)) {
    return false
  }

  if (filters.featured === 'featured' && !cause.featured) {
    return false
  }

  if (filters.featured === 'not-featured' && cause.featured) {
    return false
  }

  if (filters.verified === 'verified' && !cause.verified) {
    return false
  }

  if (filters.verified === 'unverified' && cause.verified) {
    return false
  }

  if (filters.dateFrom && new Date(cause.startDate) < new Date(filters.dateFrom)) {
    return false
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    if (new Date(cause.startDate) > dateTo) {
      return false
    }
  }

  const progress = getCauseProgress(cause)
  const progressMin = Number(filters.progressMin)
  if (filters.progressMin && !Number.isNaN(progressMin) && progress < progressMin) {
    return false
  }

  const progressMax = Number(filters.progressMax)
  if (filters.progressMax && !Number.isNaN(progressMax) && progress > progressMax) {
    return false
  }

  return true
}

function sortCauses(causes: AdminCause[], sort: AdminCauseFilters['sort']) {
  return [...causes].sort((first, second) => {
    switch (sort) {
      case 'oldest':
        return new Date(first.updatedAt).getTime() - new Date(second.updatedAt).getTime()
      case 'name':
        return first.name.localeCompare(second.name)
      case 'raised':
        return second.raised - first.raised
      case 'progress':
        return getCauseProgress(second) - getCauseProgress(first)
      case 'status':
        return first.status.localeCompare(second.status)
      case 'newest':
      default:
        return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
    }
  })
}

function getCauseProgress(cause: AdminCause) {
  if (cause.goal <= 0) {
    return 0
  }

  return Math.min(100, Math.round((cause.raised / cause.goal) * 100))
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}

function valueMatchesFilter(value: string, filter: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-') === filter.trim().toLowerCase().replace(/\s+/g, '-')
}
