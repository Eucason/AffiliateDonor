import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { formatAdminCurrency, formatAdminDate } from '@/utils/adminFormatters'
import type { AdminCampaignPerformanceReport } from '@/types/adminReport'

interface CampaignPerformanceTableProps {
  campaigns: AdminCampaignPerformanceReport[]
  isLoading?: boolean
}

export default function CampaignPerformanceTable({
  campaigns,
  isLoading = false,
}: CampaignPerformanceTableProps) {
  return (
    <AdminDataTable
      rows={campaigns}
      getRowKey={(campaign) => campaign.id}
      isLoading={isLoading}
      emptyTitle="No campaign performance found"
      emptyDescription="Adjust the campaign, search, or date filters."
      columns={[
        {
          key: 'campaign',
          header: 'Campaign',
          cell: (campaign) => (
            <div>
              <Link to={campaign.path} className="font-semibold text-primary-700 hover:text-primary-900">
                {campaign.name}
              </Link>
              <p className="mt-1 text-xs text-gray-500">{campaign.category}</p>
            </div>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          cell: (campaign) => <AdminStatusBadge status={campaign.status} />,
        },
        {
          key: 'raised',
          header: 'Raised',
          cell: (campaign) => formatAdminCurrency(campaign.raised, campaign.currency, 0),
        },
        {
          key: 'progress',
          header: 'Progress',
          cell: (campaign) => (
            <div className="min-w-40">
              <div className="mb-1 flex justify-between text-xs text-gray-500">
                <span>{campaign.progressPercent}%</span>
                <span>{formatAdminCurrency(campaign.goal, campaign.currency, 0)} goal</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-primary-500"
                  style={{ width: `${Math.min(100, campaign.progressPercent)}%` }}
                />
              </div>
            </div>
          ),
        },
        {
          key: 'donors',
          header: 'Donors',
          cell: (campaign) => campaign.donorCount.toLocaleString(),
        },
        {
          key: 'average',
          header: 'Average Gift',
          cell: (campaign) => formatAdminCurrency(campaign.averageDonation, campaign.currency, 0),
        },
        {
          key: 'updated',
          header: 'Updated',
          cell: (campaign) => formatAdminDate(campaign.updatedAt),
        },
      ]}
    />
  )
}
