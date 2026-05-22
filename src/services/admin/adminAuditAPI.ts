import apiClient from '@/lib/apiClient'
import type {
  AdminAuditLog,
  AdminAuditLogsResponse,
  AdminAuditSeverity,
  AdminAuditSummary,
  AdminAuditEntityType,
} from '@/types/adminAudit'

const mockAuditLogs: AdminAuditLog[] = [
  auditLog(
    'aud-701',
    'Olivia Grant',
    'admin',
    'approved_campaign',
    'campaign',
    'Clean Water Initiative',
    'cause-001',
    'Approved updated campaign media and goal copy.',
    'info',
    2,
  ),
  auditLog(
    'aud-702',
    'Liam Brooks',
    'analyst',
    'exported_report',
    'settings',
    'Monthly donation export',
    'export-monthly',
    'Generated monthly donation summary export.',
    'info',
    6,
  ),
  auditLog(
    'aud-703',
    'Olivia Grant',
    'admin',
    'updated_payment_settings',
    'settings',
    'Payment Settings',
    'settings-payments',
    'Changed minimum donation and public payment visibility.',
    'warning',
    18,
  ),
  auditLog(
    'aud-704',
    'Grace Miller',
    'editor',
    'scheduled_content',
    'content',
    'Spring Giving Week',
    'content-banner-giving-week',
    'Scheduled homepage banner for campaign launch.',
    'info',
    28,
  ),
  auditLog(
    'aud-705',
    'Noah Rivera',
    'support',
    'updated_donation_note',
    'donation',
    'Donation don-1045',
    'don-1045',
    'Added payment review note after failed card event.',
    'critical',
    42,
  ),
  auditLog(
    'aud-706',
    'Olivia Grant',
    'admin',
    'rejected_product',
    'approval',
    'Solar Power Bank affiliate listing',
    'apv-804',
    'Rejected product approval request pending disclosure copy.',
    'warning',
    72,
  ),
]

export const adminAuditAPI = {
  async getAuditLogs(): Promise<AdminAuditLogsResponse> {
    try {
      const response = await apiClient.get<AdminAuditLogsResponse>('/api/admin/audit-logs', { timeout: 2500 })
      const logs = response.data.logs ?? []
      return {
        logs,
        summary: response.data.summary ?? summarizeAuditLogs(logs),
      }
    } catch (error) {
      console.warn('Using admin audit fallback data because the API could not be reached.', error)
      return {
        logs: mockAuditLogs,
        summary: summarizeAuditLogs(mockAuditLogs),
      }
    }
  },
}

export function summarizeAuditLogs(logs: AdminAuditLog[]): AdminAuditSummary {
  return logs.reduce<AdminAuditSummary>(
    (summary, log) => {
      summary.totalCount += 1
      summary.criticalCount += log.severity === 'critical' ? 1 : 0
      summary.settingsChangeCount += log.entityType === 'settings' ? 1 : 0
      summary.approvalActionCount += log.entityType === 'approval' || log.action.includes('approved') || log.action.includes('rejected') ? 1 : 0
      return summary
    },
    {
      totalCount: 0,
      criticalCount: 0,
      settingsChangeCount: 0,
      approvalActionCount: 0,
    },
  )
}

function auditLog(
  id: string,
  actor: string,
  actorRole: string,
  action: string,
  entityType: AdminAuditEntityType,
  entityLabel: string,
  entityId: string,
  description: string,
  severity: AdminAuditSeverity,
  hoursAgo: number,
): AdminAuditLog {
  return {
    id,
    actor,
    actorRole,
    action,
    entityType,
    entityLabel,
    entityId,
    timestamp: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
    ipAddress: `192.0.2.${hoursAgo + 10}`,
    device: hoursAgo % 2 === 0 ? 'Chrome on Windows' : 'Safari on macOS',
    severity,
    before: {
      status: 'pending',
      note: 'Previous state snapshot placeholder',
    },
    after: {
      status: action.includes('rejected') ? 'rejected' : 'updated',
      note: description,
    },
    metadata: {
      requestId: `${id}-request`,
      source: 'admin-panel',
      description,
    },
  }
}
