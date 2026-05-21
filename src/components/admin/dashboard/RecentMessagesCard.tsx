import { Link } from 'react-router-dom'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { AdminDashboardMessage } from '@/types/adminDashboard'

interface RecentMessagesCardProps {
  messages: AdminDashboardMessage[]
}

export default function RecentMessagesCard({ messages }: RecentMessagesCardProps) {
  return (
    <AdminSectionCard
      title="Recent Messages"
      description="Latest contact and support submissions."
      actions={
        <Link to="/admin/messages" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Open inbox
        </Link>
      }
    >
      <div className="space-y-4">
        {messages.map((message) => (
          <Link
            key={message.id}
            to={`/admin/messages/${message.id}`}
            className="block rounded-lg border border-gray-100 p-3 transition hover:border-primary-200 hover:bg-primary-50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{message.subject}</p>
                <p className="truncate text-sm text-gray-600">{message.name}</p>
              </div>
              <AdminStatusBadge status={message.status} />
            </div>
            <p className="mt-2 text-xs text-gray-500">{formatTimestamp(message.receivedAt)}</p>
          </Link>
        ))}
      </div>
    </AdminSectionCard>
  )
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}
