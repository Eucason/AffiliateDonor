import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AdminLayout from '@/components/organisms/AdminLayout'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import PaymentTimeline from '@/components/admin/donations/PaymentTimeline'
import Button from '@/components/atoms/Button'
import { adminDonationsAPI } from '@/services/admin/adminDonationsAPI'
import { formatAdminCurrency, formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminDonation } from '@/types/adminDonation'

export default function AdminDonationDetailsPage() {
  const { id } = useParams()
  const [donation, setDonation] = useState<AdminDonation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDonation = useCallback(async () => {
    if (!id) {
      setError('Donation ID is missing.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setDonation(await adminDonationsAPI.getDonation(id))
    } catch (requestError) {
      console.error('Failed to load donation detail:', requestError)
      setError('This donation record could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDonation()
  }, [fetchDonation])

  const handleMarkReviewed = async () => {
    if (!donation) {
      return
    }

    setDonation(await adminDonationsAPI.markReviewed(donation.id))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link
          to="/admin/donations"
          className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-primary-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to donations
        </Link>

        {loading && <AdminLoadingState label="Loading donation details..." />}

        {error && !loading && <AdminErrorState message={error} onRetry={fetchDonation} />}

        {donation && !loading && !error && (
          <>
            <AdminPageHeader
              eyebrow="Donation Record"
              title={donation.id}
              description={`${donation.donorName} contributed to ${donation.campaignName}.`}
              actions={
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleMarkReviewed}
                    disabled={Boolean(donation.reviewedAt)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark Reviewed
                  </Button>
                  <Button type="button" variant="outline" size="sm" disabled={donation.status !== 'successful'}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Refund Placeholder
                  </Button>
                </>
              }
            />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
              <div className="space-y-6">
                <AdminSectionCard title="Payment Details">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatAdminCurrency(donation.amount, donation.currency)}
                      </p>
                    </div>
                    <AdminStatusBadge status={donation.status} />
                  </div>

                  <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                    <DetailTerm label="Transaction ID" value={donation.transactionId} />
                    <DetailTerm label="Payment Method" value={donation.method} />
                    <DetailTerm label="Created" value={formatAdminDateTime(donation.createdAt)} />
                    <DetailTerm label="Updated" value={formatAdminDateTime(donation.updatedAt)} />
                    <DetailTerm label="Donor Email" value={donation.donorEmail} />
                    <DetailTerm label="Campaign" value={donation.campaignName} />
                  </dl>
                </AdminSectionCard>

                <AdminSectionCard title="Payment Timeline">
                  <PaymentTimeline events={donation.timeline} />
                </AdminSectionCard>
              </div>

              <div className="space-y-6">
                <AdminSectionCard title="Cross Links">
                  <div className="space-y-3">
                    <LinkButton to={`/admin/users/${donation.donorId}`} label="Open donor profile" />
                    <LinkButton to={`/admin/causes/${donation.campaignId}`} label="Open campaign details" />
                    <LinkButton to="/admin/reports/donations" label="Open donation reports" />
                  </div>
                </AdminSectionCard>

                <AdminSectionCard title="Admin Notes">
                  <p className="text-sm text-gray-700">
                    {donation.adminNotes ??
                      'No admin notes have been added yet. Notes are ready to connect to audit and workflow tooling.'}
                  </p>
                  {donation.reviewedAt && (
                    <p className="mt-3 text-xs text-gray-500">
                      Reviewed by {donation.reviewedBy ?? 'Admin'} on {formatAdminDateTime(donation.reviewedAt)}
                    </p>
                  )}
                </AdminSectionCard>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

function DetailTerm({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-gray-900">{value}</dd>
    </div>
  )
}

function LinkButton({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
    >
      {label}
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  )
}
