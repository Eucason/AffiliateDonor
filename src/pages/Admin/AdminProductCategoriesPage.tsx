import { useEffect, useMemo, useState } from 'react'
import { Layers, RefreshCcw, Shirt, Tag } from 'lucide-react'
import ProductCategoryManager from '@/components/admin/products/ProductCategoryManager'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminProducts } from '@/hooks/admin/useAdminProducts'
import type { AdminProductCategory } from '@/types/adminProduct'

export default function AdminProductCategoriesPage() {
  const { filterOptions, loading, error, refetch } = useAdminProducts()
  const [categories, setCategories] = useState<AdminProductCategory[]>([])

  useEffect(() => {
    setCategories(filterOptions.categories)
  }, [filterOptions.categories])

  const summary = useMemo(() => summarizeCategories(categories), [categories])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Commerce"
          title="Product Categories"
          description="Manage the taxonomy used by affiliate products, branded merch, filters, and reporting groups."
          actions={
            <Button type="button" variant="outline" onClick={refetch} disabled={loading} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Categories" value={summary.total} icon={<Layers className="h-5 w-5" />} />
          <AdminStatCard label="Affiliate" value={summary.affiliate} icon={<Tag className="h-5 w-5" />} />
          <AdminStatCard label="Merch" value={summary.merch} icon={<Shirt className="h-5 w-5" />} />
          <AdminStatCard label="Archived" value={summary.archived} helperText={`${summary.products} products indexed`} />
        </div>

        {error && <AdminErrorState message={error} onRetry={refetch} />}

        {loading ? (
          <AdminLoadingState label="Loading product categories..." />
        ) : (
          <ProductCategoryManager categories={categories} onCategoriesChange={setCategories} />
        )}
      </div>
    </AdminLayout>
  )
}

function summarizeCategories(categories: AdminProductCategory[]) {
  return categories.reduce(
    (summary, category) => {
      summary.total += 1
      summary.affiliate += category.type === 'affiliate' ? 1 : 0
      summary.merch += category.type === 'merch' ? 1 : 0
      summary.archived += category.status === 'archived' ? 1 : 0
      summary.products += category.productCount
      return summary
    },
    {
      total: 0,
      affiliate: 0,
      merch: 0,
      archived: 0,
      products: 0,
    },
  )
}
