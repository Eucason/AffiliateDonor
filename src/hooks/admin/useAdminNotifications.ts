import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminNotificationsAPI, summarizeNotifications } from '@/services/admin/adminNotificationsAPI'
import type {
  AdminNotification,
  AdminNotificationFilterOptions,
  AdminNotificationFilters,
  AdminNotificationSeverity,
  AdminNotificationStatus,
  AdminNotificationType,
} from '@/types/adminNotification'
import type { AdminNotificationPreference } from '@/types/adminSettings'

export const defaultAdminNotificationFilters: AdminNotificationFilters = {
  search: '',
  status: 'all',
  type: 'all',
  severity: 'all',
  dateFrom: '',
  dateTo: '',
  sort: 'newest',
}

export function useAdminNotifications(initialFilters: Partial<AdminNotificationFilters> = {}) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [preferences, setPreferences] = useState<AdminNotificationPreference[]>([])
  const [filters, setFilters] = useState<AdminNotificationFilters>({
    ...defaultAdminNotificationFilters,
    ...initialFilters,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await adminNotificationsAPI.getNotifications()
      setNotifications(response.notifications)
      setPreferences(response.preferences)
    } catch (requestError) {
      console.error('Failed to load admin notifications:', requestError)
      setError('Notifications could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const filteredNotifications = useMemo(
    () => sortNotifications(notifications.filter((item) => notificationMatchesFilters(item, filters)), filters.sort),
    [notifications, filters],
  )

  const summary = useMemo(() => summarizeNotifications(filteredNotifications), [filteredNotifications])

  const filterOptions = useMemo<AdminNotificationFilterOptions>(
    () => ({
      types: uniqueSorted(notifications.map((item) => item.type)),
      severities: uniqueSorted(notifications.map((item) => item.severity)),
    }),
    [notifications],
  )

  const updateFilter = useCallback(
    <Key extends keyof AdminNotificationFilters>(key: Key, value: AdminNotificationFilters[Key]) => {
      setFilters((current) => ({ ...current, [key]: value }))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(defaultAdminNotificationFilters)
  }, [])

  const markNotification = useCallback(async (notificationId: string, status: AdminNotificationStatus) => {
    try {
      setSaving(true)
      const updated = await adminNotificationsAPI.markNotification(notificationId, status)
      setNotifications((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (requestError) {
      console.error('Failed to update admin notification:', requestError)
      setError('Notification status could not be updated. Please try again.')
    } finally {
      setSaving(false)
    }
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      setSaving(true)
      const response = await adminNotificationsAPI.markAllRead()
      setNotifications(response.notifications)
      setPreferences(response.preferences)
    } catch (requestError) {
      console.error('Failed to mark admin notifications read:', requestError)
      setError('Notifications could not be marked read. Please try again.')
    } finally {
      setSaving(false)
    }
  }, [])

  return {
    notifications,
    filteredNotifications,
    preferences,
    filterOptions,
    filters,
    summary,
    loading,
    saving,
    error,
    refetch: fetchNotifications,
    updateFilter,
    clearFilters,
    markNotification,
    markAllRead,
  }
}

function notificationMatchesFilters(notificationItem: AdminNotification, filters: AdminNotificationFilters) {
  const search = filters.search.trim().toLowerCase()
  const searchable = [
    notificationItem.title,
    notificationItem.summary,
    notificationItem.sourceLabel,
    notificationItem.type,
    notificationItem.severity,
  ].join(' ').toLowerCase()

  if (search && !searchable.includes(search)) {
    return false
  }

  if (filters.status !== 'all' && notificationItem.status !== filters.status) {
    return false
  }

  if (filters.type !== 'all' && notificationItem.type !== filters.type) {
    return false
  }

  if (filters.severity !== 'all' && notificationItem.severity !== filters.severity) {
    return false
  }

  if (filters.dateFrom && new Date(notificationItem.createdAt) < new Date(filters.dateFrom)) {
    return false
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    if (new Date(notificationItem.createdAt) > dateTo) {
      return false
    }
  }

  return true
}

function sortNotifications(notifications: AdminNotification[], sort: AdminNotificationFilters['sort']) {
  return [...notifications].sort((first, second) => {
    switch (sort) {
      case 'oldest':
        return new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
      case 'severity':
        return severityWeight(second.severity) - severityWeight(first.severity)
      case 'status':
        return first.status.localeCompare(second.status)
      case 'newest':
      default:
        return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    }
  })
}

function severityWeight(severity: AdminNotificationSeverity) {
  const weights: Record<AdminNotificationSeverity, number> = {
    critical: 4,
    warning: 3,
    success: 2,
    info: 1,
  }
  return weights[severity]
}

function uniqueSorted<T extends AdminNotificationType | AdminNotificationSeverity>(values: T[]) {
  return Array.from(new Set(values)).sort((first, second) => first.localeCompare(second))
}
