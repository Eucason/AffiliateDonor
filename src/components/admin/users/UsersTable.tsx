import { ExternalLink, Mail, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { formatAdminCurrency, formatAdminDate, formatAdminRelativeTime } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminUser } from '@/types/adminUser'

interface UsersTableProps {
  users: AdminUser[]
  isLoading?: boolean
  hasActiveFilters?: boolean
}

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  analyst: 'Analyst',
  support: 'Support',
  donor: 'Donor',
}

export default function UsersTable({ users, isLoading = false, hasActiveFilters = false }: UsersTableProps) {
  const columns: Array<AdminDataTableColumn<AdminUser>> = [
    {
      key: 'user',
      header: 'User',
      cell: (user) => (
        <div className="flex min-w-64 items-center gap-3">
          <Avatar user={user} />
          <div className="min-w-0">
            <Link to={`/admin/users/${user.id}`} className="font-semibold text-gray-900 hover:text-primary-700">
              {user.name}
            </Link>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
            <p className="mt-1 text-xs text-gray-500">Joined {formatAdminDate(user.joinedAt)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (user) => (
        <div className="space-y-2">
          <AdminStatusBadge status={user.role} label={roleLabels[user.role] ?? user.role} tone={user.role === 'donor' ? 'gray' : 'purple'} />
          <AdminStatusBadge status={user.status} tone={user.status === 'active' ? 'green' : 'gray'} />
        </div>
      ),
    },
    {
      key: 'donations',
      header: 'Donor Metrics',
      cell: (user) => (
        <div>
          <p className="font-semibold text-gray-900">{formatAdminCurrency(user.totalDonations, 'USD', 0)}</p>
          <p className="text-xs text-gray-500">
            {user.causesSupported} causes - {user.impactScore.toLocaleString()} impact
          </p>
        </div>
      ),
    },
    {
      key: 'activity',
      header: 'Last Active',
      cell: (user) => (
        <div>
          <p className="font-medium text-gray-800">{formatAdminRelativeTime(user.lastActiveAt)}</p>
          <p className="text-xs text-gray-500">{user.totalPurchases.toLocaleString()} purchases</p>
        </div>
      ),
    },
    {
      key: 'causes',
      header: 'Causes Supported',
      cell: (user) => (
        <div className="max-w-60">
          {user.supportedCauses.length > 0 ? (
            <p className="line-clamp-2 text-sm text-gray-700">{user.supportedCauses.join(', ')}</p>
          ) : (
            <span className="text-sm text-gray-400">No causes yet</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (user) => (
        <div className="flex justify-end gap-2">
          <Link
            to={`/admin/users/${user.id}`}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            title="View profile"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            to={`/admin/messages?email=${encodeURIComponent(user.email)}`}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            title="View contact messages"
          >
            <Mail className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      rows={users}
      getRowKey={(user) => user.id}
      isLoading={isLoading}
      emptyTitle={hasActiveFilters ? 'No users match these filters' : 'No users yet'}
      emptyDescription={
        hasActiveFilters
          ? 'Try changing search, role, donor state, signup date, donation amount, activity, or cause filters.'
          : 'User and donor records will appear here as people join the platform.'
      }
    />
  )
}

function Avatar({ user }: { user: AdminUser }) {
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
  }

  return (
    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
      <UserRound className="h-5 w-5" />
    </div>
  )
}
