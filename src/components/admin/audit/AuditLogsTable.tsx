import { Eye } from 'lucide-react'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { formatAdminDateTime, formatAdminRelativeTime } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminAuditLog } from '@/types/adminAudit'

interface AuditLogsTableProps {
  logs: AdminAuditLog[]
  isLoading?: boolean
  hasActiveFilters?: boolean
  onView: (log: AdminAuditLog) => void
}

const severityTone: Record<AdminAuditLog['severity'], 'gray' | 'yellow' | 'red'> = {
  info: 'gray',
  warning: 'yellow',
  critical: 'red',
}

export default function AuditLogsTable({ logs, isLoading = false, hasActiveFilters = false, onView }: AuditLogsTableProps) {
  const columns: Array<AdminDataTableColumn<AdminAuditLog>> = [
    {
      key: 'actor',
      header: 'Actor',
      cell: (log) => (
        <div className="min-w-44">
          <p className="font-semibold text-gray-900">{log.actor}</p>
          <p className="text-xs text-gray-500">{log.actorRole}</p>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      cell: (log) => (
        <div className="max-w-md">
          <p className="font-semibold text-gray-900">{formatAction(log.action)}</p>
          <p className="mt-1 text-sm text-gray-600">{log.metadata.description}</p>
        </div>
      ),
    },
    {
      key: 'entity',
      header: 'Entity',
      cell: (log) => (
        <div>
          <AdminStatusBadge status={log.entityType} />
          <p className="mt-2 text-sm font-medium text-gray-800">{log.entityLabel}</p>
          <p className="text-xs text-gray-500">{log.entityId}</p>
        </div>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      cell: (log) => (
        <div>
          <p className="font-medium text-gray-800">{formatAdminDateTime(log.timestamp)}</p>
          <p className="text-xs text-gray-500">{formatAdminRelativeTime(log.timestamp)}</p>
        </div>
      ),
    },
    {
      key: 'device',
      header: 'IP / Device',
      cell: (log) => (
        <div>
          <p className="font-medium text-gray-800">{log.ipAddress}</p>
          <p className="text-xs text-gray-500">{log.device}</p>
          <AdminStatusBadge status={log.severity} tone={severityTone[log.severity]} className="mt-2" />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (log) => (
        <Button type="button" variant="ghost" size="sm" className="px-3" title="View audit details" onClick={() => onView(log)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      rows={logs}
      getRowKey={(log) => log.id}
      isLoading={isLoading}
      emptyTitle={hasActiveFilters ? 'No audit logs match these filters' : 'No audit logs yet'}
      emptyDescription={
        hasActiveFilters
          ? 'Try changing search, actor, action, entity, or date filters.'
          : 'Admin activity will appear here after system events are recorded.'
      }
    />
  )
}

function formatAction(action: string) {
  return action.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}
