import { Mail, MapPin, Phone, Shield, UserRound } from 'lucide-react'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { formatAdminCurrency, formatAdminDate, formatAdminRelativeTime } from '@/utils/adminFormatters'
import type { AdminUser } from '@/types/adminUser'

interface DonorProfileHeaderProps {
  user: AdminUser
}

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  analyst: 'Analyst',
  support: 'Support',
  donor: 'Donor',
}

export default function DonorProfileHeader({ user }: DonorProfileHeaderProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar user={user} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <AdminStatusBadge status={user.role} label={roleLabels[user.role] ?? user.role} tone={user.role === 'donor' ? 'gray' : 'purple'} />
              <AdminStatusBadge status={user.status} tone={user.status === 'active' ? 'green' : 'gray'} />
            </div>
            <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {user.email}
              </span>
              {user.phone && (
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {user.phone}
                </span>
              )}
              {user.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {user.location}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                Joined {formatAdminDate(user.joinedAt)}
              </span>
            </div>
            <p className="mt-3 text-xs text-gray-500">Last active {formatAdminRelativeTime(user.lastActiveAt)}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-96">
          <Metric label="Total Donations" value={formatAdminCurrency(user.totalDonations, 'USD', 0)} />
          <Metric label="Purchases" value={user.totalPurchases.toLocaleString()} />
          <Metric label="Causes Supported" value={user.causesSupported.toLocaleString()} />
          <Metric label="Impact Score" value={user.impactScore.toLocaleString()} />
        </div>
      </div>
    </div>
  )
}

function Avatar({ user }: { user: AdminUser }) {
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.name} className="h-16 w-16 rounded-full object-cover" />
  }

  return (
    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
      <UserRound className="h-7 w-7" />
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
    </div>
  )
}
