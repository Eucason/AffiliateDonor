import { ExternalLink, Eye, MailOpen, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import MessageStatusBadge from './MessageStatusBadge'
import { formatAdminDate, formatAdminRelativeTime } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminMessage } from '@/types/adminMessage'

interface MessagesInboxTableProps {
  messages: AdminMessage[]
  isLoading?: boolean
  hasActiveFilters?: boolean
  onView: (message: AdminMessage) => void
  onMarkRead: (message: AdminMessage) => void
}

export default function MessagesInboxTable({
  messages,
  isLoading = false,
  hasActiveFilters = false,
  onView,
  onMarkRead,
}: MessagesInboxTableProps) {
  const columns: Array<AdminDataTableColumn<AdminMessage>> = [
    {
      key: 'sender',
      header: 'Sender',
      cell: (message) => (
        <div className="min-w-56">
          <p className="font-semibold text-gray-900">{message.senderName}</p>
          <p className="truncate text-xs text-gray-500">{message.senderEmail}</p>
          {message.donorMatch && (
            <Link
              to={`/admin/users/${message.donorMatch.id}`}
              className="mt-1 inline-flex items-center text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              <UserRound className="mr-1 h-3.5 w-3.5" />
              Donor match
            </Link>
          )}
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      cell: (message) => (
        <div className="max-w-xl">
          <button
            type="button"
            onClick={() => onView(message)}
            className="text-left font-semibold text-gray-900 hover:text-primary-700"
          >
            {message.subject}
          </button>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{message.body}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (message) => (
        <div className="space-y-2">
          <MessageStatusBadge status={message.status} />
          <AdminStatusBadge status={message.severity} label={message.severity} tone={message.severity === 'urgent' ? 'red' : message.severity === 'priority' ? 'yellow' : 'gray'} />
        </div>
      ),
    },
    {
      key: 'assigned',
      header: 'Assigned',
      cell: (message) => message.assignedAdmin,
    },
    {
      key: 'received',
      header: 'Received',
      cell: (message) => (
        <div>
          <p className="font-medium text-gray-800">{formatAdminDate(message.receivedAt)}</p>
          <p className="text-xs text-gray-500">{formatAdminRelativeTime(message.receivedAt)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (message) => (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            title="Open message panel"
            onClick={() => onView(message)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            title="Mark read"
            disabled={message.status !== 'unread'}
            onClick={() => onMarkRead(message)}
          >
            <MailOpen className="h-4 w-4" />
          </Button>
          <Link
            to={`/admin/messages/${message.id}`}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            title="Open details page"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      rows={messages}
      getRowKey={(message) => message.id}
      isLoading={isLoading}
      emptyTitle={hasActiveFilters ? 'No messages match these filters' : 'No contact messages yet'}
      emptyDescription={
        hasActiveFilters
          ? 'Try changing search, status, assignment, donor match, severity, or received date filters.'
          : 'Contact form submissions and support messages will appear here.'
      }
    />
  )
}
