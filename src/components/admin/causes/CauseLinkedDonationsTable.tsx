import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { formatAdminCurrency, formatAdminDate } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminCauseDonation } from '@/types/adminCause'

interface CauseLinkedDonationsTableProps {
  donations: AdminCauseDonation[]
}

export default function CauseLinkedDonationsTable({ donations }: CauseLinkedDonationsTableProps) {
  const columns: Array<AdminDataTableColumn<AdminCauseDonation>> = [
    {
      key: 'donor',
      header: 'Donor',
      cell: (donation) => (
        <div>
          <p className="font-semibold text-gray-900">{donation.donorName}</p>
          <p className="text-xs text-gray-500">{donation.donorEmail}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (donation) => (
        <p className="font-semibold text-gray-900">
          {formatAdminCurrency(donation.amount, donation.currency)}
        </p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (donation) => <AdminStatusBadge status={donation.status} />,
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

  return (
    <AdminDataTable
      columns={columns}
      rows={donations}
      getRowKey={(donation) => donation.id}
      emptyTitle="No linked donations"
      emptyDescription="Donations connected to this campaign will appear here."
    />
  )
}
