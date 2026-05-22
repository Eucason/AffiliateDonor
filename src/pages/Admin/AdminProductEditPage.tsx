import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, RefreshCcw } from 'lucide-react'
import ConversionTrackingTable from '@/components/admin/products/ConversionTrackingTable'
import MerchInventoryPanel from '@/components/admin/products/MerchInventoryPanel'
import ProductForm from '@/components/admin/products/ProductForm'
import ProductPerformanceCard from '@/components/admin/products/ProductPerformanceCard'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminProducts } from '@/hooks/admin/useAdminProducts'
import { adminProductsAPI, productToFormData } from '@/services/admin/adminProductsAPI'
import type { AdminProduct, AdminProductFormData } from '@/types/adminProduct'

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const { filterOptions, loading: categoryLoading, error: categoryError, refetch } = useAdminProducts()
  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [formData, setFormData] = useState<AdminProductFormData | null>(null)
  const [inventoryValue, setInventoryValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadProduct = async () => {
      if (!id) {
        setActionError('Missing product id.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setActionError(null)
        const loadedProduct = await adminProductsAPI.getProduct(id)
        if (!active) {
          return
        }
        setProduct(loadedProduct)
        setFormData(productToFormData(loadedProduct))
        setInventoryValue(loadedProduct.inventoryQuantity === undefined ? '' : String(loadedProduct.inventoryQuantity))
      } catch (requestError) {
        console.error('Failed to load product:', requestError)
        if (active) {
          setActionError('Product could not be loaded.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      active = false
    }
  }, [id])

  const reloadProduct = async () => {
    if (!id) {
      return
    }
    const loadedProduct = await adminProductsAPI.getProduct(id)
    setProduct(loadedProduct)
    setFormData(productToFormData(loadedProduct))
    setInventoryValue(loadedProduct.inventoryQuantity === undefined ? '' : String(loadedProduct.inventoryQuantity))
  }

  const handleSubmit = async (nextFormData: AdminProductFormData) => {
    if (!id) {
      return
    }

    try {
      setSaving(true)
      setActionError(null)
      const updated = await adminProductsAPI.updateProduct(id, nextFormData)
      setProduct(updated)
      setFormData(productToFormData(updated))
      setInventoryValue(updated.inventoryQuantity === undefined ? '' : String(updated.inventoryQuantity))
    } catch (requestError) {
      console.error('Failed to save product:', requestError)
      setActionError('Product could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const handleInventorySave = async () => {
    if (!product) {
      return
    }

    try {
      setSaving(true)
      setActionError(null)
      const updated = await adminProductsAPI.updateInventory(product.id, Number(inventoryValue) || 0)
      setProduct(updated)
      setFormData(productToFormData(updated))
      setInventoryValue(updated.inventoryQuantity === undefined ? '' : String(updated.inventoryQuantity))
    } catch (requestError) {
      console.error('Failed to update inventory:', requestError)
      setActionError('Inventory could not be updated.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Commerce"
          title={product?.name ?? 'Edit Product'}
          description="Update product details, type-specific fields, inventory, and tracking data."
          actions={
            <>
              <Button type="button" variant="outline" onClick={reloadProduct} disabled={loading || saving} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Link
                to={product?.type === 'merch' ? '/admin/products/merch' : '/admin/products/affiliate'}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to List
              </Link>
              {product?.affiliateUrl && (
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Affiliate URL
                </a>
              )}
            </>
          }
        />

        {(categoryError || actionError) && <AdminErrorState message={categoryError ?? actionError ?? ''} onRetry={refetch} />}

        {loading || categoryLoading || !product || !formData ? (
          <AdminLoadingState label="Loading product editor..." />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-6">
              <ProductForm
                initialData={formData}
                categories={filterOptions.categories}
                submitLabel="Save Product"
                isSubmitting={saving}
                onSubmit={handleSubmit}
              />
              <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900">Conversion Tracking</h2>
                <p className="mt-1 text-sm text-gray-600">Click and conversion windows that product reports can consume.</p>
                <div className="mt-4">
                  <ConversionTrackingTable conversions={product.conversions} />
                </div>
              </section>
            </div>
            <div className="space-y-6">
              <ProductPerformanceCard products={[product]} />
              <MerchInventoryPanel
                product={product}
                value={inventoryValue}
                busy={saving}
                onChange={setInventoryValue}
                onSave={handleInventorySave}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
