import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProductForm from '@/components/admin/products/ProductForm'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminProducts } from '@/hooks/admin/useAdminProducts'
import { adminProductsAPI, emptyProductFormData } from '@/services/admin/adminProductsAPI'
import type { AdminProductFormData, AdminProductType } from '@/types/adminProduct'

export default function AdminProductCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedType = searchParams.get('type') === 'merch' ? 'merch' : 'affiliate'
  const initialData = useMemo(() => emptyProductFormData(requestedType as AdminProductType), [requestedType])
  const { filterOptions, loading, error, refetch } = useAdminProducts()
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const handleSubmit = async (formData: AdminProductFormData) => {
    try {
      setSaving(true)
      setActionError(null)
      const product = await adminProductsAPI.createProduct(formData)
      navigate(`/admin/products/${product.id}/edit`)
    } catch (requestError) {
      console.error('Failed to create product:', requestError)
      setActionError('Product could not be created.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Commerce"
          title="Create Product"
          description="Add an affiliate or merch product with type-specific fields, cause allocation, category, and publishing status."
          actions={
            <Link
              to={requestedType === 'merch' ? '/admin/products/merch' : '/admin/products/affiliate'}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Link>
          }
        />

        {(error || actionError) && <AdminErrorState message={error ?? actionError ?? ''} onRetry={refetch} />}

        {loading ? (
          <AdminLoadingState label="Loading product categories..." />
        ) : (
          <ProductForm
            initialData={initialData}
            categories={filterOptions.categories}
            submitLabel="Create Product"
            isSubmitting={saving}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </AdminLayout>
  )
}
