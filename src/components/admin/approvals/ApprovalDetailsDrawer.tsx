import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminDetailDrawer from '@/components/admin/shared/AdminDetailDrawer'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminApprovalRequest, AdminApprovalStatus } from '@/types/adminApproval'

interface ApprovalDetailsDrawerProps {
  approval: AdminApprovalRequest | null
  open: boolean
  isSaving?: boolean
  onClose: () => void
  onReview: (id: string, status: Extract<AdminApprovalStatus, 'approved' | 'rejected'>, comment: string) => void
}

export default function ApprovalDetailsDrawer({
  approval,
  open,
  isSaving = false,
  onClose,
  onReview,
}: ApprovalDetailsDrawerProps) {
  const [comment, setComment] = useState('')

  useEffect(() => {
    setComment('')
  }, [approval?.id])

  if (!approval) {
    return null
  }

  const canReview = approval.status === 'pending'

  return (
    <AdminDetailDrawer open={open} title={approval.title} onClose={onClose}>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <AdminStatusBadge status={approval.type} />
          <AdminStatusBadge status={approval.status} tone={approval.status === 'approved' ? 'green' : approval.status === 'rejected' ? 'red' : 'yellow'} />
          <AdminStatusBadge status={approval.priority} tone={approval.priority === 'urgent' ? 'red' : approval.priority === 'high' ? 'yellow' : 'gray'} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Request summary</h3>
          <p className="mt-2 text-sm text-gray-600">{approval.summary}</p>
          <p className="mt-2 text-sm text-gray-600">{approval.impact}</p>
        </div>
        <dl className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm sm:grid-cols-2">
          <Detail label="Requested by" value={approval.requestedBy} />
          <Detail label="Submitted" value={formatAdminDateTime(approval.submittedAt)} />
          <Detail label="Related entity" value={approval.relatedEntityLabel} />
          <Detail label="Entity ID" value={approval.relatedEntityId} />
          {approval.reviewer && <Detail label="Reviewer" value={approval.reviewer} />}
          {approval.reviewedAt && <Detail label="Reviewed" value={formatAdminDateTime(approval.reviewedAt)} />}
        </dl>
        <Link to={approval.relatedEntityPath} className="inline-flex text-sm font-semibold text-primary-700 hover:text-primary-900">
          Open related admin record
        </Link>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Comments</h3>
          <div className="mt-3 space-y-3">
            {approval.comments.map((item) => (
              <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-sm font-semibold text-gray-900">{item.author}</p>
                <p className="mt-1 text-sm text-gray-600">{item.body}</p>
                <p className="mt-2 text-xs text-gray-500">{formatAdminDateTime(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
        {canReview && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Review comment</span>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <div className="mt-3 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" disabled={isSaving} onClick={() => onReview(approval.id, 'rejected', comment)}>
                Reject
              </Button>
              <Button type="button" variant="primary" size="sm" disabled={isSaving} onClick={() => onReview(approval.id, 'approved', comment)}>
                Approve
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminDetailDrawer>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 font-medium text-gray-900">{value}</dd>
    </div>
  )
}
