import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminUsersAPI, summarizeUsers } from '@/services/admin/adminUsersAPI'
import type { AdminUser, AdminUserFilterOptions, AdminUserFilters } from '@/types/adminUser'

export const defaultAdminUserFilters: AdminUserFilters = {
  search: '',
  role: 'all',
  donorState: 'all',
  signupFrom: '',
  signupTo: '',
  donationMin: '',
  donationMax: '',
  activityStatus: 'all',
  cause: 'all',
  sort: 'newest',
}

export function useAdminUsers(initialFilters: Partial<AdminUserFilters> = {}) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filters, setFilters] = useState<AdminUserFilters>({
    ...defaultAdminUserFilters,
    ...initialFilters,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminUsersAPI.getUsers()
      setUsers(response.users)
    } catch (requestError) {
      console.error('Failed to load admin users:', requestError)
      setError('User and donor records could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = useMemo(() => {
    return sortUsers(users.filter((user) => userMatchesFilters(user, filters)), filters.sort)
  }, [users, filters])

  const summary = useMemo(() => summarizeUsers(filteredUsers), [filteredUsers])

  const filterOptions = useMemo<AdminUserFilterOptions>(
    () => ({
      roles: uniqueSorted(users.map((user) => user.role)),
      causes: uniqueSorted(users.flatMap((user) => user.supportedCauses)),
    }),
    [users],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminUserFilters>(key: Key, value: AdminUserFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminUserFilters)
  }, [])

  const replaceUser = useCallback((updatedUser: AdminUser) => {
    setUsers((current) => current.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
  }, [])

  return {
    users,
    filteredUsers,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch: fetchUsers,
    updateFilter,
    clearFilters,
    replaceUser,
  }
}

function userMatchesFilters(user: AdminUser, filters: AdminUserFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    user.id,
    user.name,
    user.email,
    user.role,
    user.status,
    user.supportedCauses.join(' '),
  ]
    .join(' ')
    .toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }

  if (filters.role !== 'all' && user.role !== filters.role) {
    return false
  }

  if (filters.donorState === 'donors' && user.totalDonations <= 0) {
    return false
  }

  if (filters.donorState === 'non-donors' && user.totalDonations > 0) {
    return false
  }

  if (filters.activityStatus !== 'all' && user.status !== filters.activityStatus) {
    return false
  }

  if (filters.cause !== 'all' && !user.supportedCauses.some((cause) => valueMatchesFilter(cause, filters.cause))) {
    return false
  }

  if (filters.signupFrom && new Date(user.joinedAt) < new Date(filters.signupFrom)) {
    return false
  }

  if (filters.signupTo) {
    const signupTo = new Date(filters.signupTo)
    signupTo.setHours(23, 59, 59, 999)
    if (new Date(user.joinedAt) > signupTo) {
      return false
    }
  }

  const donationMin = Number(filters.donationMin)
  if (filters.donationMin && !Number.isNaN(donationMin) && user.totalDonations < donationMin) {
    return false
  }

  const donationMax = Number(filters.donationMax)
  if (filters.donationMax && !Number.isNaN(donationMax) && user.totalDonations > donationMax) {
    return false
  }

  return true
}

function sortUsers(users: AdminUser[], sort: AdminUserFilters['sort']) {
  return [...users].sort((first, second) => {
    switch (sort) {
      case 'oldest':
        return new Date(first.joinedAt).getTime() - new Date(second.joinedAt).getTime()
      case 'name':
        return first.name.localeCompare(second.name)
      case 'total-donations':
        return second.totalDonations - first.totalDonations
      case 'impact':
        return second.impactScore - first.impactScore
      case 'last-active':
        return new Date(second.lastActiveAt).getTime() - new Date(first.lastActiveAt).getTime()
      case 'role':
        return first.role.localeCompare(second.role)
      case 'newest':
      default:
        return new Date(second.joinedAt).getTime() - new Date(first.joinedAt).getTime()
    }
  })
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}

function valueMatchesFilter(value: string, filter: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-') === filter.trim().toLowerCase().replace(/\s+/g, '-')
}
