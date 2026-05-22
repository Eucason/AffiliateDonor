import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminDonationsAPI, summarizeDonations } from '@/services/admin/adminDonationsAPI'
import type {
  AdminDonation,
  AdminDonationFilterOptions,
  AdminDonationFilters,
} from '@/types/adminDonation'

export const defaultAdminDonationFilters: AdminDonationFilters = {
  search: '',
  status: 'all',
  campaign: 'all',
  method: 'all',
  currency: 'all',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  sort: 'newest',
}

export function useAdminDonations(initialFilters: Partial<AdminDonationFilters> = {}) {
  const [donations, setDonations] = useState<AdminDonation[]>([])
  const [filters, setFilters] = useState<AdminDonationFilters>({
    ...defaultAdminDonationFilters,
    ...initialFilters,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDonations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminDonationsAPI.getDonations()
      setDonations(response.donations)
    } catch (requestError) {
      console.error('Failed to load admin donations:', requestError)
      setError('Donation records could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDonations()
  }, [fetchDonations])

  const filteredDonations = useMemo(() => {
    return sortDonations(donations.filter((donation) => donationMatchesFilters(donation, filters)), filters.sort)
  }, [donations, filters])

  const summary = useMemo(() => summarizeDonations(filteredDonations), [filteredDonations])

  const filterOptions = useMemo<AdminDonationFilterOptions>(
    () => ({
      campaigns: uniqueSorted(donations.map((donation) => donation.campaignName)),
      methods: uniqueSorted(donations.map((donation) => donation.method)),
      currencies: uniqueSorted(donations.map((donation) => donation.currency)),
    }),
    [donations],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminDonationFilters>(key: Key, value: AdminDonationFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminDonationFilters)
  }, [])

  return {
    donations,
    filteredDonations,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch: fetchDonations,
    setFilters,
    updateFilter,
    clearFilters,
  }
}

function donationMatchesFilters(donation: AdminDonation, filters: AdminDonationFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    donation.id,
    donation.donorName,
    donation.donorEmail,
    donation.campaignName,
    donation.transactionId,
    donation.method,
    donation.status,
  ]
    .join(' ')
    .toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }

  if (filters.status !== 'all' && donation.status !== filters.status) {
    return false
  }

  if (
    filters.campaign !== 'all' &&
    !valueMatchesFilter(donation.campaignName, filters.campaign) &&
    !valueMatchesFilter(donation.campaignId, filters.campaign)
  ) {
    return false
  }

  if (filters.method !== 'all' && !valueMatchesFilter(donation.method, filters.method)) {
    return false
  }

  if (filters.currency !== 'all' && donation.currency !== filters.currency) {
    return false
  }

  if (filters.dateFrom && new Date(donation.createdAt) < new Date(filters.dateFrom)) {
    return false
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    if (new Date(donation.createdAt) > dateTo) {
      return false
    }
  }

  const amountMin = Number(filters.amountMin)
  if (filters.amountMin && !Number.isNaN(amountMin) && donation.amount < amountMin) {
    return false
  }

  const amountMax = Number(filters.amountMax)
  if (filters.amountMax && !Number.isNaN(amountMax) && donation.amount > amountMax) {
    return false
  }

  return true
}

function sortDonations(donations: AdminDonation[], sort: AdminDonationFilters['sort']) {
  return [...donations].sort((first, second) => {
    switch (sort) {
      case 'oldest':
        return new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
      case 'highest':
        return second.amount - first.amount
      case 'lowest':
        return first.amount - second.amount
      case 'status':
        return first.status.localeCompare(second.status)
      case 'campaign':
        return first.campaignName.localeCompare(second.campaignName)
      case 'newest':
      default:
        return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    }
  })
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}

function valueMatchesFilter(value: string, filter: string) {
  return normalizeFilterValue(value) === normalizeFilterValue(filter)
}

function normalizeFilterValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}
