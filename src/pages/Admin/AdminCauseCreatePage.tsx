import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import CauseForm from '@/components/admin/causes/CauseForm'
import AdminLayout from '@/components/organisms/AdminLayout'
import { adminCausesAPI } from '@/services/admin/adminCausesAPI'
import type { AdminCauseFormData } from '@/types/adminCause'

export default function AdminCauseCreatePage() {
  const navigate = useNavigate()

  const handleSubmit = async (formData: AdminCauseFormData) => {
    await adminCausesAPI.createCause(formData)
    navigate('/admin/causes')
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

        <AdminPageHeader
          eyebrow="Campaign Setup"
          title="New Campaign"
          description="Create a campaign with publishing controls, media fields, funding goals, and SEO metadata."
        />

        <CauseForm submitLabel="Create Campaign" onSubmit={handleSubmit} />
      </div>
    </AdminLayout>
  )
}
