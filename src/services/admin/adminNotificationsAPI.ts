import apiClient from '@/lib/apiClient'
import { defaultNotificationPreferences } from '@/services/admin/adminSettingsAPI'
import type {
  AdminNotification,
  AdminNotificationSeverity,
  AdminNotificationSummary,
  AdminNotificationsResponse,
  AdminNotificationStatus,
  AdminNotificationType,
} from '@/types/adminNotification'

const fallbackStorageKey = 'affiliateDonor.adminNotifications'

const mockNotifications: AdminNotification[] = [
  notification(
    'ntf-501',
    'payment',
    'Stripe webhook retry needed',
    'A failed payment event has not reconciled after three delivery attempts.',
    'unread',
    'critical',
    'Donation don-1045',
    '/admin/donations/don-1045',
    1,
  ),
  notification(
    'ntf-502',
    'campaign',
    'Campaign ready for approval',
    'Hunger Relief updated its goal, hero image, and verification notes.',
    'unread',
    'warning',
    'Hunger Relief',
    '/admin/approvals',
    4,
  ),
  notification(
    'ntf-503',
    'message',
    'New partner message',
    'A corporate partner asked about matched giving opportunities.',
    'read',
    'info',
    'Contact message msg-308',
    '/admin/messages/msg-308',
    8,
  ),
  notification(
    'ntf-504',
    'product',
    'Low merch inventory',
    'Impact Hoodie medium inventory is below the configured threshold.',
    'unread',
    'warning',
    'Impact Hoodie',
    '/admin/products/merch',
    18,
  ),
  notification(
    'ntf-505',
    'donation',
    'Large donation received',
    'A $500 donation was completed for Clean Water Initiative.',
    'read',
    'success',
    'Donation don-1044',
    '/admin/donations/don-1044',
    24,
  ),
  notification(
    'ntf-506',
    'content',
    'Scheduled banner needs review',
    'Spring Giving Week is scheduled but missing final approval.',
    'archived',
    'info',
    'Spring Giving Week',
    '/admin/content/banners',
    72,
  ),
]

export const adminNotificationsAPI = {
  async getNotifications(): Promise<AdminNotificationsResponse> {
    try {
      const response = await apiClient.get<AdminNotificationsResponse>('/api/admin/notifications', { timeout: 2500 })
      return normalizeNotificationsResponse(response.data)
    } catch (error) {
      console.warn('Using admin notifications fallback data because the API could not be reached.', error)
      const notifications = getFallbackNotifications()
      return {
        notifications,
        preferences: defaultNotificationPreferences,
        summary: summarizeNotifications(notifications),
      }
    }
  },

  async markNotification(id: string, status: AdminNotificationStatus): Promise<AdminNotification> {
    const notifications = getFallbackNotifications()
    const current = notifications.find((item) => item.id === id)

    if (!current) {
      throw new Error('Notification not found.')
    }

    const updated: AdminNotification = {
      ...current,
      status,
      readAt: status === 'read' ? new Date().toISOString() : undefined,
    }

    try {
      const response = await apiClient.patch<AdminNotification>(`/api/admin/notifications/${id}`, { status })
      saveFallbackNotification(response.data)
      return response.data
    } catch (error) {
      console.warn('Updating notification in fallback storage because the API could not be reached.', error)
      saveFallbackNotification(updated)
      return updated
    }
  },

  async markAllRead(): Promise<AdminNotificationsResponse> {
    try {
      const response = await apiClient.post<AdminNotificationsResponse>('/api/admin/notifications/read-all')
      const normalized = normalizeNotificationsResponse(response.data)
      writeStoredNotifications(normalized.notifications)
      return normalized
    } catch (error) {
      console.warn('Marking notifications read in fallback storage because the API could not be reached.', error)
      const readAt = new Date().toISOString()
      const notifications: AdminNotification[] = getFallbackNotifications().map((item) => ({
        ...item,
        status: item.status === 'archived' ? item.status : 'read',
        readAt: item.status === 'archived' ? item.readAt : readAt,
      }))
      writeStoredNotifications(notifications)
      return {
        notifications,
        preferences: defaultNotificationPreferences,
        summary: summarizeNotifications(notifications),
      }
    }
  },
}

export function summarizeNotifications(notifications: AdminNotification[]): AdminNotificationSummary {
  return notifications.reduce<AdminNotificationSummary>(
    (summary, notificationItem) => {
      summary.totalCount += 1
      summary.unreadCount += notificationItem.status === 'unread' ? 1 : 0
      summary.criticalCount += notificationItem.severity === 'critical' ? 1 : 0
      summary.archivedCount += notificationItem.status === 'archived' ? 1 : 0
      return summary
    },
    {
      totalCount: 0,
      unreadCount: 0,
      criticalCount: 0,
      archivedCount: 0,
    },
  )
}

function normalizeNotificationsResponse(response: AdminNotificationsResponse): AdminNotificationsResponse {
  const notifications = response.notifications ?? []

  return {
    notifications,
    preferences: response.preferences?.length ? response.preferences : defaultNotificationPreferences,
    summary: response.summary ?? summarizeNotifications(notifications),
  }
}

function notification(
  id: string,
  type: AdminNotificationType,
  title: string,
  summary: string,
  status: AdminNotificationStatus,
  severity: AdminNotificationSeverity,
  sourceLabel: string,
  sourcePath: string,
  hoursAgo: number,
): AdminNotification {
  const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

  return {
    id,
    type,
    title,
    summary,
    status,
    severity,
    sourceLabel,
    sourcePath,
    createdAt,
    readAt: status === 'read' ? createdAt : undefined,
  }
}

function getFallbackNotifications() {
  return mergeNotifications(mockNotifications, readStoredNotifications())
}

function saveFallbackNotification(notificationItem: AdminNotification) {
  const stored = getFallbackNotifications().map((item) => (item.id === notificationItem.id ? notificationItem : item))
  writeStoredNotifications(stored)
}

function readStoredNotifications(): AdminNotification[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const value = window.localStorage.getItem(fallbackStorageKey)
    return value ? (JSON.parse(value) as AdminNotification[]) : []
  } catch (error) {
    console.warn('Stored admin notifications could not be parsed.', error)
    return []
  }
}

function writeStoredNotifications(notifications: AdminNotification[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(fallbackStorageKey, JSON.stringify(notifications))
}

function mergeNotifications(base: AdminNotification[], overrides: AdminNotification[]) {
  const byId = new Map<string, AdminNotification>()
  base.forEach((item) => byId.set(item.id, item))
  overrides.forEach((item) => byId.set(item.id, item))
  return Array.from(byId.values())
}
