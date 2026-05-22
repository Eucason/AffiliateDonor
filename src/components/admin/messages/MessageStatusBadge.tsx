import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { AdminStatusTone } from '@/types/admin'
import type { AdminMessageStatus } from '@/types/adminMessage'

interface MessageStatusBadgeProps {
  status: AdminMessageStatus
  className?: string
}

const statusTone: Record<AdminMessageStatus, AdminStatusTone> = {
  unread: 'primary',
  read: 'gray',
  pending: 'yellow',
  replied: 'blue',
  resolved: 'green',
  archived: 'gray',
  spam: 'red',
}

const statusLabel: Record<AdminMessageStatus, string> = {
  unread: 'Unread',
  read: 'Read',
  pending: 'Pending',
  replied: 'Replied',
  resolved: 'Resolved',
  archived: 'Archived',
  spam: 'Spam',
}

export default function MessageStatusBadge({ status, className }: MessageStatusBadgeProps) {
  return <AdminStatusBadge status={status} label={statusLabel[status]} tone={statusTone[status]} className={className} />
}
