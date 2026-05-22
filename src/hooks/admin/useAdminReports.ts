import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  adminReportsAPI,
  buildExportItems,
  summarizeReports,
} from '@/services/admin/adminReportsAPI'
import type {
  AdminDonationReportRecord,
  AdminDonationTrendPoint,
  AdminReportFilterOptions,
  AdminReportFilters,
  AdminReportGranularity,
  AdminReportsResponse,
} from '@/types/adminReport'

export const defaultAdminReportFilters: AdminReportFilters = {
  search: '',
  dateFrom: dateDaysAgo(90),
  dateTo: toDateInputValue(new Date()),
  granularity: 'daily',
  campaign: 'all',
  donationStatus: 'all',
  paymentMethod: 'all',
  productType: 'all',
  contentType: 'all',
}

export function useAdminReports(initialFilters: Partial<AdminReportFilters> = {}) {
  const [reports, setReports] = useState<AdminReportsResponse | null>(null)
  const [filters, setFilters] = useState<AdminReportFilters>({
    ...defaultAdminReportFilters,
    ...initialFilters,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setReports(await adminReportsAPI.getReports())
    } catch (requestError) {
      console.error('Failed to load admin reports:', requestError)
      setError('Reports could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const filteredReports = useMemo(() => {
    if (!reports) {
      return null
    }

    const donationRecords = reports.donationRecords.filter((record) => donationRecordMatches(record, filters))
    const donationTrends = buildDonationTrends(donationRecords)
    const campaignPerformance = reports.campaignPerformance.filter((campaign) => {
      if (!dateInRange(campaign.updatedAt, filters)) {
        return false
      }
      if (!matchesSearch([campaign.name, campaign.category, campaign.status], filters.search)) {
        return false
      }
      return filters.campaign === 'all' || campaign.name === filters.campaign
    })
    const donorGrowth = reports.donorGrowth.filter((point) => dateInRange(point.date, filters))
    const contentPerformance = reports.contentPerformance.filter((item) => {
      if (!dateInRange(item.updatedAt, filters)) {
        return false
      }
      if (!matchesSearch([item.title, item.type, item.status], filters.search)) {
        return false
      }
      return filters.contentType === 'all' || normalizeOption(item.type) === normalizeOption(filters.contentType)
    })
    const productPerformance = reports.productPerformance.filter((product) => {
      if (!dateInRange(product.updatedAt, filters)) {
        return false
      }
      if (!matchesSearch([product.name, product.type, product.status, product.linkedCauseName], filters.search)) {
        return false
      }
      if (filters.productType !== 'all' && product.type !== filters.productType) {
        return false
      }
      return filters.campaign === 'all' || product.linkedCauseName === filters.campaign
    })
    const summary = summarizeReports({
      donationTrends: donationTrends[filters.granularity],
      campaignPerformance,
      donorGrowth,
      contentPerformance,
      productPerformance,
    })

    return {
      ...reports,
      summary,
      donationRecords,
      donationTrends,
      campaignPerformance,
      donorGrowth,
      contentPerformance,
      productPerformance,
      exports: buildExportItems(summary, {
        donationTrends: donationTrends[filters.granularity],
        campaignPerformance,
        donorGrowth,
        contentPerformance,
        productPerformance,
      }),
    }
  }, [filters, reports])

  const updateFilter = useCallback(
    <Key extends keyof AdminReportFilters>(key: Key, value: AdminReportFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminReportFilters)
  }, [])

  return {
    reports,
    filteredReports,
    filterOptions: reports?.filterOptions ?? ({
      campaigns: [],
      donationStatuses: [],
      paymentMethods: [],
      productTypes: ['affiliate', 'merch'],
      contentTypes: [],
    } satisfies AdminReportFilterOptions),
    filters,
    loading,
    error,
    refetch: fetchReports,
    updateFilter,
    clearFilters,
  }
}

function donationRecordMatches(record: AdminDonationReportRecord, filters: AdminReportFilters) {
  if (!dateInRange(record.createdAt, filters)) {
    return false
  }
  if (!matchesSearch([record.id, record.campaignName, record.status, record.method], filters.search)) {
    return false
  }
  if (filters.campaign !== 'all' && record.campaignName !== filters.campaign) {
    return false
  }
  if (filters.donationStatus !== 'all' && record.status !== filters.donationStatus) {
    return false
  }
  if (filters.paymentMethod !== 'all' && record.method !== filters.paymentMethod) {
    return false
  }
  return true
}

function buildDonationTrends(records: AdminDonationReportRecord[]) {
  return (['daily', 'weekly', 'monthly'] as AdminReportGranularity[]).reduce<
    Record<AdminReportGranularity, AdminDonationTrendPoint[]>
  >(
    (trends, granularity) => {
      trends[granularity] = groupDonationRecords(records, granularity)
      return trends
    },
    {
      daily: [],
      weekly: [],
      monthly: [],
    },
  )
}

function groupDonationRecords(
  records: AdminDonationReportRecord[],
  granularity: AdminReportGranularity,
): AdminDonationTrendPoint[] {
  const groups = new Map<string, AdminDonationTrendPoint>()

  records.forEach((record) => {
    const groupDate = getGroupDate(new Date(record.createdAt), granularity)
    const key = groupDate.toISOString().slice(0, 10)
    const existing = groups.get(key) ?? {
      id: `${granularity}-${key}`,
      label: formatTrendLabel(groupDate, granularity),
      date: key,
      donationCount: 0,
      successfulCount: 0,
      pendingCount: 0,
      failedOrRefundedCount: 0,
      amount: 0,
    }

    existing.donationCount += 1
    existing.successfulCount += record.status === 'successful' ? 1 : 0
    existing.pendingCount += record.status === 'pending' ? 1 : 0
    existing.failedOrRefundedCount += record.status === 'failed' || record.status === 'refunded' ? 1 : 0
    existing.amount += record.status === 'successful' ? record.amount : 0
    groups.set(key, existing)
  })

  return Array.from(groups.values()).sort(
    (first, second) => new Date(first.date).getTime() - new Date(second.date).getTime(),
  )
}

function matchesSearch(values: string[], search: string) {
  const normalizedSearch = search.trim().toLowerCase()
  if (!normalizedSearch) {
    return true
  }
  return values.join(' ').toLowerCase().includes(normalizedSearch)
}

function dateInRange(value: string, filters: Pick<AdminReportFilters, 'dateFrom' | 'dateTo'>) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return true
  }

  if (filters.dateFrom && date < new Date(filters.dateFrom)) {
    return false
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    if (date > dateTo) {
      return false
    }
  }

  return true
}

function getGroupDate(date: Date, granularity: AdminReportGranularity) {
  if (granularity === 'monthly') {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }
  if (granularity === 'weekly') {
    const groupDate = new Date(date)
    const day = groupDate.getDay()
    const offset = day === 0 ? -6 : 1 - day
    groupDate.setDate(groupDate.getDate() + offset)
    groupDate.setHours(0, 0, 0, 0)
    return groupDate
  }
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  return dayStart
}

function formatTrendLabel(date: Date, granularity: AdminReportGranularity) {
  if (granularity === 'monthly') {
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
  }
  if (granularity === 'weekly') {
    return `Week of ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)}`
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function normalizeOption(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, '-')
}

function dateDaysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return toDateInputValue(date)
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10)
}
