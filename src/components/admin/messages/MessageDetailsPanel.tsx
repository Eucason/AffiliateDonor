import { Link } from 'react-router-dom'
import { ExternalLink, Mail, X } from 'lucide-react'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import MessageAdminNotes from './MessageAdminNotes'
import MessageAssignmentControl from './MessageAssignmentControl'
import MessageStatusBadge from './MessageStatusBadge'
import { formatAdminCurrency, formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminMessage, AdminMessageStatus } from '@/types/adminMessage'

interface MessageDetailsPanelProps {
  message: AdminMessage
  onClose?: () => void
  onStatusChange: (status: AdminMessageStatus) => Promise<void>
  onAssign: (assignedAdmin: string) => Promise<void>
  onAddNote: (body: string) => Promise<void>
}

const nextStatuses: AdminMessageStatus[] = ['unread', 'read', 'pending', 'replied', 'resolved', 'archived', 'spam']

export default function MessageDetailsPanel({
  message,
  onClose,
  onStatusChange,
  onAssign,
  onAddNote,
}: MessageDetailsPanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Message</p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">{message.subject}</h2>
          <p className="mt-1 text-sm text-gray-600">
            From {message.senderName} - {message.senderEmail}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close message details"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <MessageStatusBadge status={message.status} />
        <AdminStatusBadge status={message.severity} label={message.severity} tone={message.severity === 'urgent' ? 'red' : message.severity === 'priority' ? 'yellow' : 'gray'} />
        <AdminStatusBadge status={message.source} label={message.source.replace('_', ' ')} tone="blue" />
      </div>

      <AdminSectionCard title="Message Body">
        <p className="whitespace-pre-line text-sm leading-6 text-gray-700">{message.body}</p>
        <p className="mt-4 text-xs text-gray-500">
          Received {formatAdminDateTime(message.receivedAt)} - Updated {formatAdminDateTime(message.updatedAt)}
        </p>
      </AdminSectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminSectionCard title="Status">
          <div className="grid gap-2">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                type="button"
                variant={message.status === status ? 'primary' : 'outline'}
                size="sm"
                disabled={message.status === status}
                onClick={() => onStatusChange(status)}
              >
                {status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Assignment">
          <MessageAssignmentControl value={message.assignedAdmin} onAssign={onAssign} />
        </AdminSectionCard>
      </div>

      <AdminSectionCard title="Related Donor">
        {message.donorMatch ? (
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-900">{message.donorMatch.name}</p>
              <p className="text-sm text-gray-600">{message.donorMatch.email}</p>
              <p className="mt-2 text-sm text-gray-600">
                {formatAdminCurrency(message.donorMatch.totalDonations, 'USD', 0)} total donations -{' '}
                {message.donorMatch.causesSupported} causes supported
              </p>
            </div>
            <Link
              to={`/admin/users/${message.donorMatch.id}`}
              className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open donor profile
            </Link>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
            No donor match was found for this email.
          </p>
        )}
      </AdminSectionCard>

      <AdminSectionCard title="Related Donations">
        {message.relatedDonations.length > 0 ? (
          <div className="space-y-3">
            {message.relatedDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-3">
                <div>
                  <Link to={`/admin/donations/${donation.id}`} className="font-semibold text-gray-900 hover:text-primary-700">
                    {donation.campaignName}
                  </Link>
                  <p className="text-xs text-gray-500">{formatAdminDateTime(donation.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatAdminCurrency(donation.amount, donation.currency)}</p>
                  <AdminStatusBadge status={donation.status} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
            No related donation records are connected yet.
          </p>
        )}
      </AdminSectionCard>

      <AdminSectionCard title="Admin Notes">
        <MessageAdminNotes notes={message.notes} onAddNote={onAddNote} />
      </AdminSectionCard>

      <a
        href={`mailto:${message.senderEmail}?subject=Re: ${encodeURIComponent(message.subject)}`}
        className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
      >
        <Mail className="mr-2 h-4 w-4" />
        Reply in Email Client
      </a>
    </div>
  )
}
