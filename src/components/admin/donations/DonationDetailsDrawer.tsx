import { CheckCircle2, ExternalLink, RotateCcw, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import PaymentTimeline from './PaymentTimeline'
import { formatAdminCurrency, formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminDonation } from '@/types/adminDonation'

interface DonationDetailsDrawerProps {
  donation: AdminDonation | null
  open: boolean
  onClose: () => void
  onMarkReviewed?: (donation: AdminDonation) => void
}

export default function DonationDetailsDrawer({
  donation,
  open,
  onClose,
  onMarkReviewed,
}: DonationDetailsDrawerProps) {
  if (!open || !donation) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/30">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close drawer" />
      <aside className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Donation Details</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900">{donation.id}</h2>
              <p className="mt-1 text-sm text-gray-600">{donation.transactionId}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close donation details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAdminCurrency(donation.amount, donation.currency)}
              </p>
            </div>
            <AdminStatusBadge status={donation.status} className="self-start sm:self-center" />
          </div>

          <AdminSectionCard title="Contributor">
            <dl className="grid gap-4 sm:grid-cols-2">
              <DetailTerm label="Donor" value={donation.donorName} />
              <DetailTerm label="Email" value={donation.donorEmail} />
              <DetailTerm label="Campaign" value={donation.campaignName} />
              <DetailTerm label="Payment method" value={donation.method} />
              <DetailTerm label="Created" value={formatAdminDateTime(donation.createdAt)} />
              <DetailTerm label="Updated" value={formatAdminDateTime(donation.updatedAt)} />
            </dl>
          </AdminSectionCard>

          <AdminSectionCard title="Payment Timeline">
            <PaymentTimeline events={donation.timeline} />
          </AdminSectionCard>

          <AdminSectionCard title="Admin Notes">
            <p className="text-sm text-gray-700">
              {donation.adminNotes ??
                'No admin notes have been added yet. Notes can be connected to the audit workflow when provider actions are enabled.'}
            </p>
            {donation.reviewedAt && (
              <p className="mt-3 text-xs text-gray-500">
                Reviewed by {donation.reviewedBy ?? 'Admin'} on {formatAdminDateTime(donation.reviewedAt)}
              </p>
            )}
          </AdminSectionCard>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onMarkReviewed?.(donation)}
              disabled={Boolean(donation.reviewedAt)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Reviewed
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={donation.status !== 'successful'}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Refund Placeholder
            </Button>
            <Link
              to={`/admin/donations/${donation.id}`}
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Full Page
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

function DetailTerm({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-900">{value}</dd>
    </div>
  )
}
