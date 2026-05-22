import { ExternalLink, MailOpen, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { formatAdminDateTime, formatAdminRelativeTime } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminNotification } from '@/types/adminNotification'

interface NotificationsListProps {
  notifications: AdminNotification[]
  isLoading?: boolean
  hasActiveFilters?: boolean
  onMarkRead: (notification: AdminNotification) => void
  onMarkUnread: (notification: AdminNotification) => void
}

const severityTone: Record<AdminNotification['severity'], 'gray' | 'green' | 'yellow' | 'red'> = {
  info: 'gray',
  success: 'green',
  warning: 'yellow',
  critical: 'red',
}

export default function NotificationsList({
  notifications,
  isLoading = false,
  hasActiveFilters = false,
  onMarkRead,
  onMarkUnread,
}: NotificationsListProps) {
  const columns: Array<AdminDataTableColumn<AdminNotification>> = [
    {
      key: 'notification',
      header: 'Notification',
      cell: (notification) => (
        <div className="max-w-xl">
          <p className="font-semibold text-gray-900">{notification.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{notification.summary}</p>
          <Link to={notification.sourcePath} className="mt-2 inline-flex items-center text-xs font-semibold text-primary-700 hover:text-primary-900">
            {notification.sourceLabel}
            <ExternalLink className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (notification) => (
        <div className="space-y-2">
          <AdminStatusBadge status={notification.type} />
          <AdminStatusBadge status={notification.severity} tone={severityTone[notification.severity]} />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (notification) => <AdminStatusBadge status={notification.status} tone={notification.status === 'unread' ? 'primary' : 'gray'} />,
    },
    {
      key: 'created',
      header: 'Created',
      cell: (notification) => (
        <div>
          <p className="font-medium text-gray-800">{formatAdminDateTime(notification.createdAt)}</p>
          <p className="text-xs text-gray-500">{formatAdminRelativeTime(notification.createdAt)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (notification) => (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            title="Mark read"
            disabled={notification.status !== 'unread'}
            onClick={() => onMarkRead(notification)}
          >
            <MailOpen className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            title="Mark unread"
            disabled={notification.status === 'unread' || notification.status === 'archived'}
            onClick={() => onMarkUnread(notification)}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      rows={notifications}
      getRowKey={(notification) => notification.id}
      isLoading={isLoading}
      emptyTitle={hasActiveFilters ? 'No notifications match these filters' : 'No admin notifications'}
      emptyDescription={
        hasActiveFilters
          ? 'Try changing search, status, type, severity, or date filters.'
          : 'Operational alerts will appear here when admin attention is needed.'
      }
    />
  )
}
