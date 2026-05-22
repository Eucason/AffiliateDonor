import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { buildCsv, downloadCsv } from '@/utils/adminExport'
import { formatAdminCurrency, formatAdminDate } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminUser, AdminUserDonation } from '@/types/adminUser'

interface DonorDonationHistoryProps {
  user: AdminUser
}

export default function DonorDonationHistory({ user }: DonorDonationHistoryProps) {
  const columns: Array<AdminDataTableColumn<AdminUserDonation>> = [
    {
      key: 'campaign',
      header: 'Campaign',
      cell: (donation) => (
        <Link to={`/admin/causes/${donation.campaignId}`} className="font-semibold text-gray-900 hover:text-primary-700">
          {donation.campaignName}
        </Link>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (donation) => (
        <div>
          <p className="font-semibold text-gray-900">{formatAdminCurrency(donation.amount, donation.currency)}</p>
          <p className="text-xs text-gray-500">{donation.method}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (donation) => <AdminStatusBadge status={donation.status} />,
    },
    {
      key: 'transaction',
      header: 'Transaction',
      cell: (donation) => <span className="text-xs font-medium text-gray-600">{donation.transactionId}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      cell: (donation) => formatAdminDate(donation.createdAt),
    },
    {
      key: 'action',
      header: '',
      className: 'text-right',
      cell: (donation) => (
        <Link to={`/admin/donations/${donation.id}`} className="font-semibold text-primary-600 hover:text-primary-700">
          View
        </Link>
      ),
    },
  ]

  const exportHistory = () => {
    const csv = buildCsv(user.donationHistory, [
      { header: 'Donation ID', value: (donation) => donation.id },
      { header: 'Campaign', value: (donation) => donation.campaignName },
      { header: 'Amount', value: (donation) => donation.amount },
      { header: 'Currency', value: (donation) => donation.currency },
      { header: 'Method', value: (donation) => donation.method },
      { header: 'Status', value: (donation) => donation.status },
      { header: 'Transaction ID', value: (donation) => donation.transactionId },
      { header: 'Created At', value: (donation) => donation.createdAt },
    ])

    downloadCsv(`${user.id}-donation-history.csv`, csv)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" disabled={user.donationHistory.length === 0} onClick={exportHistory}>
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>
      <AdminDataTable
        columns={columns}
        rows={user.donationHistory}
        getRowKey={(donation) => donation.id}
        emptyTitle="No donation history"
        emptyDescription="This user does not have donation records yet."
      />
    </div>
  )
}
