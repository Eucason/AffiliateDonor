import type { AdminNotificationPreference } from '@/types/adminSettings'

export type AdminNotificationType =
  | 'donation'
  | 'payment'
  | 'message'
  | 'campaign'
  | 'content'
  | 'product'
  | 'system'

export type AdminNotificationStatus = 'unread' | 'read' | 'archived'

export type AdminNotificationSeverity = 'info' | 'success' | 'warning' | 'critical'

export interface AdminNotification {
  id: string
  type: AdminNotificationType
  title: string
  summary: string
  status: AdminNotificationStatus
  severity: AdminNotificationSeverity
  sourceLabel: string
  sourcePath: string
  createdAt: string
  readAt?: string
}

export interface AdminNotificationFilters {
  search: string
  status: 'all' | AdminNotificationStatus
  type: 'all' | AdminNotificationType
  severity: 'all' | AdminNotificationSeverity
  dateFrom: string
  dateTo: string
  sort: 'newest' | 'oldest' | 'severity' | 'status'
}

export interface AdminNotificationFilterOptions {
  types: AdminNotificationType[]
  severities: AdminNotificationSeverity[]
}

export interface AdminNotificationSummary {
  totalCount: number
  unreadCount: number
  criticalCount: number
  archivedCount: number
}

export interface AdminNotificationsResponse {
  notifications: AdminNotification[]
  preferences: AdminNotificationPreference[]
  summary: AdminNotificationSummary
}
