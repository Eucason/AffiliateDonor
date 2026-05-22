import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import CauseForm from '@/components/admin/causes/CauseForm'
import AdminLayout from '@/components/organisms/AdminLayout'
import { adminCausesAPI, causeToFormData } from '@/services/admin/adminCausesAPI'
import type { AdminCause, AdminCauseFormData } from '@/types/adminCause'

export default function AdminCauseEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
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
      console.error('Failed to load campaign editor:', requestError)
      setError('This campaign could not be loaded for editing.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCause()
  }, [fetchCause])

  const handleSubmit = async (formData: AdminCauseFormData) => {
    if (!cause) {
      return
    }

    const updated = await adminCausesAPI.updateCause(cause.id, formData)
    navigate(`/admin/causes/${updated.id}`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link
          to={cause ? `/admin/causes/${cause.id}` : '/admin/causes'}
          className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-primary-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to campaign
        </Link>

        {loading && <AdminLoadingState label="Loading campaign editor..." />}

        {error && !loading && <AdminErrorState message={error} onRetry={fetchCause} />}

        {cause && !loading && !error && (
          <>
            <AdminPageHeader
              eyebrow="Campaign Editor"
              title={`Edit ${cause.name}`}
              description="Update campaign details, funding goal, publishing state, media, and SEO fields."
            />

            <CauseForm initialValue={causeToFormData(cause)} submitLabel="Save Campaign" onSubmit={handleSubmit} />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
