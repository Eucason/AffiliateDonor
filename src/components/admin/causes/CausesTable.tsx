import { Archive, Edit, ExternalLink, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { formatAdminCurrency, formatAdminDate } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminCause } from '@/types/adminCause'

interface CausesTableProps {
  causes: AdminCause[]
  isLoading?: boolean
  hasActiveFilters?: boolean
  onArchive: (cause: AdminCause) => void
}

export default function CausesTable({
  causes,
  isLoading = false,
  hasActiveFilters = false,
  onArchive,
}: CausesTableProps) {
  const columns: Array<AdminDataTableColumn<AdminCause>> = [
    {
      key: 'campaign',
      header: 'Campaign',
      cell: (cause) => (
        <div className="flex min-w-64 items-center gap-3">
          <img
            src={cause.mainImage}
            alt={cause.name}
            className="h-14 w-20 rounded-lg border border-gray-200 object-cover"
          />
          <div className="min-w-0">
            <Link to={`/admin/causes/${cause.id}`} className="font-semibold text-gray-900 hover:text-primary-700">
              {cause.name}
            </Link>
            <p className="truncate text-xs text-gray-500">{cause.slug}</p>
            <p className="mt-1 text-xs text-gray-500">{cause.category} - {cause.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Progress',
      cell: (cause) => {
        const progress = getProgress(cause)

        return (
          <div className="min-w-48">
            <div className="mb-2 flex justify-between text-xs">
              <span className="font-semibold text-gray-800">
                {formatAdminCurrency(cause.raised, cause.currency, 0)}
              </span>
              <span className="text-gray-500">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-primary-600" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Goal {formatAdminCurrency(cause.goal, cause.currency, 0)}
            </p>
          </div>
        )
      },
    },
    {
      key: 'supporters',
      header: 'Supporters',
      cell: (cause) => cause.supporters.toLocaleString(),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (cause) => (
        <div className="space-y-2">
          <AdminStatusBadge status={cause.status} />
          <div className="flex flex-wrap gap-1">
            {cause.featured && <AdminStatusBadge status="featured" />}
            {cause.verified && <AdminStatusBadge status="verified" label="Verified" tone="blue" />}
          </div>
        </div>
      ),
    },
    {
      key: 'updated',
      header: 'Updated',
      cell: (cause) => formatAdminDate(cause.updatedAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (cause) => (
        <div className="flex justify-end gap-2">
          <Link
            to={`/admin/causes/${cause.id}`}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            title="View campaign details"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/admin/causes/${cause.id}/edit`}
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            title="Edit campaign"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <a
            href={`/cause/${cause.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            title="View public campaign"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            title="Archive campaign"
            disabled={cause.status === 'archived'}
            onClick={() => onArchive(cause)}
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      rows={causes}
      getRowKey={(cause) => cause.id}
      isLoading={isLoading}
      emptyTitle={hasActiveFilters ? 'No campaigns match these filters' : 'No campaigns yet'}
      emptyDescription={
        hasActiveFilters
          ? 'Try changing search, publishing status, category, featured, verified, date, or progress filters.'
          : 'Campaigns and causes will appear here once they are created.'
      }
    />
  )
}

function getProgress(cause: AdminCause) {
  if (cause.goal <= 0) {
    return 0
  }

  return Math.min(100, Math.round((cause.raised / cause.goal) * 100))
}
