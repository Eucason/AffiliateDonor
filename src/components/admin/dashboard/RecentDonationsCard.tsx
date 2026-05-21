import { Link } from 'react-router-dom'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { AdminDashboardDonation } from '@/types/adminDashboard'

interface RecentDonationsCardProps {
  donations: AdminDashboardDonation[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function RecentDonationsCard({ donations }: RecentDonationsCardProps) {
  return (
    <AdminSectionCard
      title="Recent Donations"
      description="Latest contribution and payment activity."
      actions={
        <Link to="/admin/donations" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          View all
        </Link>
      }
    >
      <div className="space-y-4">
        {donations.map((donation) => (
          <div key={donation.id} className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="min-w-0">
              <Link
                to={`/admin/donations/${donation.id}`}
                className="font-semibold text-gray-900 hover:text-primary-700"
              >
                {donation.donorName}
              </Link>
              <p className="truncate text-sm text-gray-600">{donation.campaign}</p>
              <p className="mt-1 text-xs text-gray-500">
                {donation.method} - {formatRelativeTime(donation.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{currencyFormatter.format(donation.amount)}</p>
              <AdminStatusBadge status={donation.status} className="mt-2" />
            </div>
          </div>
        ))}
      </div>
    </AdminSectionCard>
  )
}

function formatRelativeTime(value: string) {
  const diffMinutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000))

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }

  return `${Math.round(diffHours / 24)}d ago`
}
