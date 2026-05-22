import { Check, Eye, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { formatAdminDateTime, formatAdminRelativeTime } from '@/utils/adminFormatters'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminApprovalRequest } from '@/types/adminApproval'

interface ApprovalsQueueTableProps {
  approvals: AdminApprovalRequest[]
  isLoading?: boolean
  isSaving?: boolean
  hasActiveFilters?: boolean
  onView: (approval: AdminApprovalRequest) => void
  onApprove: (approval: AdminApprovalRequest) => void
  onReject: (approval: AdminApprovalRequest) => void
}

const priorityTone: Record<AdminApprovalRequest['priority'], 'gray' | 'yellow' | 'red'> = {
  normal: 'gray',
  high: 'yellow',
  urgent: 'red',
}

export default function ApprovalsQueueTable({
  approvals,
  isLoading = false,
  isSaving = false,
  hasActiveFilters = false,
  onView,
  onApprove,
  onReject,
}: ApprovalsQueueTableProps) {
  const columns: Array<AdminDataTableColumn<AdminApprovalRequest>> = [
    {
      key: 'request',
      header: 'Request',
      cell: (approval) => (
        <div className="max-w-xl">
          <button type="button" onClick={() => onView(approval)} className="text-left font-semibold text-gray-900 hover:text-primary-700">
            {approval.title}
          </button>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{approval.summary}</p>
          <Link to={approval.relatedEntityPath} className="mt-2 inline-flex text-xs font-semibold text-primary-700 hover:text-primary-900">
            {approval.relatedEntityLabel}
          </Link>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (approval) => (
        <div className="space-y-2">
          <AdminStatusBadge status={approval.type} />
          <AdminStatusBadge status={approval.priority} tone={priorityTone[approval.priority]} />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (approval) => <AdminStatusBadge status={approval.status} tone={approval.status === 'approved' ? 'green' : approval.status === 'rejected' ? 'red' : 'yellow'} />,
    },
    {
      key: 'requester',
      header: 'Requested By',
      cell: (approval) => (
        <div>
          <p className="font-medium text-gray-800">{approval.requestedBy}</p>
          <p className="text-xs text-gray-500">{formatAdminRelativeTime(approval.submittedAt)}</p>
        </div>
      ),
    },
    {
      key: 'submitted',
      header: 'Submitted',
      cell: (approval) => formatAdminDateTime(approval.submittedAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (approval) => (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" className="px-3" title="View approval" onClick={() => onView(approval)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            title="Approve"
            disabled={isSaving || approval.status !== 'pending'}
            onClick={() => onApprove(approval)}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-3"
            title="Reject"
            disabled={isSaving || approval.status !== 'pending'}
            onClick={() => onReject(approval)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      rows={approvals}
      getRowKey={(approval) => approval.id}
      isLoading={isLoading}
      emptyTitle={hasActiveFilters ? 'No approvals match these filters' : 'No approvals in the queue'}
      emptyDescription={
        hasActiveFilters
          ? 'Try changing search, status, type, priority, or date filters.'
          : 'Campaign, content, product, and refund requests will appear here.'
      }
    />
  )
}
