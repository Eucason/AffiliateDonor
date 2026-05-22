import { Copy, ExternalLink, Eye, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { formatAdminCurrency, formatAdminDate, formatAdminRelativeTime } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminDonation } from '@/types/adminDonation'

interface DonationsTableProps {
  donations: AdminDonation[]
  isLoading?: boolean
  hasActiveFilters?: boolean
  onView: (donation: AdminDonation) => void
}

export default function DonationsTable({
  donations,
  isLoading = false,
  hasActiveFilters = false,
  onView,
}: DonationsTableProps) {
  const columns: Array<AdminDataTableColumn<AdminDonation>> = [
    {
      key: 'donor',
      header: 'Donor',
      cell: (donation) => (
        <div className="min-w-48">
          <Link
            to={`/admin/users/${donation.donorId}`}
            className="font-semibold text-gray-900 hover:text-primary-700"
          >
            {donation.donorName}
          </Link>
          <p className="mt-1 text-xs text-gray-500">{donation.donorEmail}</p>
        </div>
      ),
    },
    {
      key: 'campaign',
      header: 'Campaign',
      cell: (donation) => (
        <Link
          to={`/admin/causes/${donation.campaignId}`}
          className="font-medium text-gray-800 hover:text-primary-700"
        >
          {donation.campaignName}
        </Link>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (donation) => (
        <div>
          <p className="font-semibold text-gray-900">
            {formatAdminCurrency(donation.amount, donation.currency)}
          </p>
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
      header: 'Transaction ID',
      cell: (donation) => (
        <button
          type="button"
          onClick={() => copyTransactionId(donation.transactionId)}
          className="inline-flex max-w-40 items-center gap-2 truncate rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          title="Copy transaction ID"
        >
          <Copy className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{donation.transactionId}</span>
        </button>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (donation) => (
        <div>
          <p className="font-medium text-gray-800">{formatAdminDate(donation.createdAt)}</p>
          <p className="text-xs text-gray-500">{formatAdminRelativeTime(donation.createdAt)}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (donation) => (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            onClick={() => onView(donation)}
            title="Open details drawer"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Link
            to={`/admin/donations/${donation.id}`}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            title="Open details page"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            title="Refund placeholder"
            disabled={donation.status !== 'successful'}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      rows={donations}
      getRowKey={(donation) => donation.id}
      isLoading={isLoading}
      emptyTitle={hasActiveFilters ? 'No donations match these filters' : 'No donations yet'}
      emptyDescription={
        hasActiveFilters
          ? 'Try changing the search term, payment status, campaign, method, date, or amount filters.'
          : 'Donation activity will appear here when contributors complete checkout.'
      }
    />
  )
}

async function copyTransactionId(transactionId: string) {
  await navigator.clipboard?.writeText(transactionId)
}
