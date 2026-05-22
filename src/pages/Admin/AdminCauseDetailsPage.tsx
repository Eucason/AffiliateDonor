import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Archive, CheckCircle2, Edit, ExternalLink, RadioTower } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import CauseLinkedDonationsTable from '@/components/admin/causes/CauseLinkedDonationsTable'
import CauseMediaManager from '@/components/admin/causes/CauseMediaManager'
import CauseProgressCard from '@/components/admin/causes/CauseProgressCard'
import AdminLayout from '@/components/organisms/AdminLayout'
import Button from '@/components/atoms/Button'
import { adminCausesAPI } from '@/services/admin/adminCausesAPI'
import { formatAdminDate, formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminCause } from '@/types/adminCause'

export default function AdminCauseDetailsPage() {
  const { id } = useParams()
  const [cause, setCause] = useState<AdminCause | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCause = useCallback(async () => {
    if (!id) {
      setError('Campaign ID is missing.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setCause(await adminCausesAPI.getCause(id))
    } catch (requestError) {
      console.error('Failed to load campaign detail:', requestError)
      setError('This campaign could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCause()
  }, [fetchCause])

  const updateStatus = async (status: AdminCause['status']) => {
    if (!cause) {
      return
    }

    setCause(await adminCausesAPI.updateStatus(cause.id, status))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link
          to="/admin/causes"
          className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-primary-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to causes
        </Link>

        {loading && <AdminLoadingState label="Loading campaign details..." />}

        {error && !loading && <AdminErrorState message={error} onRetry={fetchCause} />}

        {cause && !loading && !error && (
          <>
            <AdminPageHeader
              eyebrow="Campaign Details"
              title={cause.name}
              description={cause.description}
              actions={
                <>
                  <a
                    href={`/cause/${cause.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Public Preview
                  </a>
                  <Link
                    to={`/admin/causes/${cause.id}/edit`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </>
              }
            />

            <div className="flex flex-wrap gap-2">
              <AdminStatusBadge status={cause.status} />
              {cause.featured && <AdminStatusBadge status="featured" />}
              {cause.verified && <AdminStatusBadge status="verified" label="Verified" tone="blue" />}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.8fr)]">
              <div className="space-y-6">
                <CauseProgressCard cause={cause} />

                <AdminSectionCard title="Linked Donations" description="Recent contribution records connected to this campaign.">
                  <CauseLinkedDonationsTable donations={cause.linkedDonations} />
                </AdminSectionCard>

                <AdminSectionCard title="Activity Timeline">
                  <div className="space-y-4">
                    {cause.activity.map((event) => (
                      <div key={event.id} className="border-l-2 border-primary-200 pl-4">
                        <p className="font-semibold text-gray-900">{event.label}</p>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatAdminDateTime(event.occurredAt)} by {event.actor}
                        </p>
                      </div>
                    ))}
                  </div>
                </AdminSectionCard>
              </div>

              <div className="space-y-6">
                <AdminSectionCard title="Campaign Metadata">
                  <dl className="grid gap-4">
                    <DetailTerm label="Slug" value={cause.slug} />
                    <DetailTerm label="Category" value={cause.category} />
                    <DetailTerm label="Location" value={cause.location} />
                    <DetailTerm label="Start Date" value={formatAdminDate(cause.startDate)} />
                    <DetailTerm label="End Date" value={cause.endDate ? formatAdminDate(cause.endDate) : 'Open ended'} />
                    <DetailTerm label="Updated" value={formatAdminDateTime(cause.updatedAt)} />
                  </dl>
                </AdminSectionCard>

                <AdminSectionCard title="Publishing Actions">
                  <div className="grid gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus('active')}
                      disabled={cause.status === 'active'}
                    >
                      <RadioTower className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus('draft')}
                      disabled={cause.status === 'draft'}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Unpublish to Draft
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => updateStatus('archived')}
                      disabled={cause.status === 'archived'}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </AdminSectionCard>

                <CauseMediaManager cause={cause} />
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
