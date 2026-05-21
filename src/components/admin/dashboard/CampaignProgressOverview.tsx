import { Link } from 'react-router-dom'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { AdminDashboardCampaign } from '@/types/adminDashboard'

interface CampaignProgressOverviewProps {
  campaigns: AdminDashboardCampaign[]
}

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export default function CampaignProgressOverview({ campaigns }: CampaignProgressOverviewProps) {
  return (
    <AdminSectionCard
      title="Campaign Progress"
      description="Funding progress for active campaigns."
      actions={
        <Link to="/admin/causes" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Manage campaigns
        </Link>
      }
    >
      <div className="space-y-5">
        {campaigns.map((campaign) => {
          const progress = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))

          return (
            <div key={campaign.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link to={`/admin/causes/${campaign.id}`} className="font-semibold text-gray-900 hover:text-primary-700">
                    {campaign.name}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {campaign.category} - {campaign.supporters.toLocaleString()} supporters
                  </p>
                </div>
                <AdminStatusBadge status={campaign.status} />
              </div>
              <div className="mt-3">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{compactCurrencyFormatter.format(campaign.raised)}</span>
                  <span className="text-gray-500">
                    {progress}% of {compactCurrencyFormatter.format(campaign.goal)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-primary-600" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AdminSectionCard>
  )
}
