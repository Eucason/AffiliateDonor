export type AdminAuditEntityType =
  | 'donation'
  | 'campaign'
  | 'content'
  | 'product'
  | 'user'
  | 'settings'
  | 'notification'
  | 'approval'

export type AdminAuditSeverity = 'info' | 'warning' | 'critical'

export interface AdminAuditLog {
  id: string
  actor: string
  actorRole: string
  action: string
  entityType: AdminAuditEntityType
  entityLabel: string
  entityId: string
  timestamp: string
  ipAddress: string
  device: string
  severity: AdminAuditSeverity
  before: Record<string, unknown>
  after: Record<string, unknown>
  metadata: Record<string, string>
}

export interface AdminAuditLogFilters {
  search: string
  actor: string
  action: string
  entityType: 'all' | AdminAuditEntityType
  dateFrom: string
  dateTo: string
  sort: 'newest' | 'oldest' | 'actor' | 'action' | 'entity'
}

export interface AdminAuditFilterOptions {
  actors: string[]
  actions: string[]
  entityTypes: AdminAuditEntityType[]
}

export interface AdminAuditSummary {
  totalCount: number
  criticalCount: number
  settingsChangeCount: number
  approvalActionCount: number
}

export interface AdminAuditLogsResponse {
  logs: AdminAuditLog[]
  summary: AdminAuditSummary
}
