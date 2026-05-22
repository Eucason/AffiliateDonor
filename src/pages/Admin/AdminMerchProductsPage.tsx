import { Link } from 'react-router-dom'
import { PackagePlus, RefreshCcw, Search } from 'lucide-react'
import AdminEmptyState from '@/components/admin/shared/AdminEmptyState'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import ProductPerformanceCard from '@/components/admin/products/ProductPerformanceCard'
import ProductStatusSummary from '@/components/admin/products/ProductStatusSummary'
import ProductsTable from '@/components/admin/products/ProductsTable'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminProducts } from '@/hooks/admin/useAdminProducts'
import { adminProductsAPI } from '@/services/admin/adminProductsAPI'
import type { AdminProductFilters, AdminProductStatus } from '@/types/adminProduct'

export default function AdminMerchProductsPage() {
  const {
    filteredProducts,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
    replaceProduct,
    removeProduct,
  } = useAdminProducts('merch')

  const handleStatusChange = async (id: string, status: AdminProductStatus) => {
    replaceProduct(await adminProductsAPI.updateStatus(id, status))
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this merch product from the admin catalog?')
    if (!confirmed) {
      return
    }

    await adminProductsAPI.deleteProduct(id)
    removeProduct(id)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Commerce"
          title="Merchandise"
          description="Manage branded merch, SKU data, inventory thresholds, product status, and cause allocation."
          actions={
            <>
              <Button type="button" variant="outline" onClick={refetch} disabled={loading} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Link
                to="/admin/products/new?type=merch"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                <PackagePlus className="h-4 w-4" />
                New Merch
              </Link>
            </>
          }
        />

        <ProductStatusSummary summary={summary} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-5">
            <MerchProductFilters
              filters={filters}
              options={filterOptions}
              onChange={updateFilter}
              onClear={clearFilters}
            />

            {error && <AdminErrorState message={error} onRetry={refetch} />}

            {loading ? (
              <AdminLoadingState label="Loading merchandise..." />
            ) : filteredProducts.length === 0 ? (
              <AdminEmptyState
                title="No merch products found"
                description="Create merch or adjust the active filters."
                actionLabel="Create Merch"
                onAction={() => window.location.assign('/admin/products/new?type=merch')}
                icon={<PackagePlus className="h-6 w-6" />}
              />
            ) : (
              <ProductsTable
                products={filteredProducts}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            )}
          </div>

          <ProductPerformanceCard products={filteredProducts} />
        </div>
      </div>
    </AdminLayout>
  )
}

interface MerchProductFiltersProps {
  filters: AdminProductFilters
  options: ReturnType<typeof useAdminProducts>['filterOptions']
  onChange: <Key extends keyof AdminProductFilters>(key: Key, value: AdminProductFilters[Key]) => void
  onClear: () => void
}

function MerchProductFilters({ filters, options, onChange, onClear }: MerchProductFiltersProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="space-y-1 xl:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search</span>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={filters.search}
              onChange={(event) => onChange('search', event.target.value)}
              placeholder="Name, brand, SKU, cause, status"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Category</span>
          <select
            value={filters.category}
            onChange={(event) => onChange('category', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All categories</option>
            {options.categories
              .filter((category) => category.type === 'merch' || category.type === 'all')
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange('status', event.target.value as AdminProductFilters['status'])}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All statuses</option>
            {options.statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Inventory</span>
          <select
            value={filters.inventoryState}
            onChange={(event) => onChange('inventoryState', event.target.value as AdminProductFilters['inventoryState'])}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All inventory</option>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.featured}
            onChange={(event) => onChange('featured', event.target.value as AdminProductFilters['featured'])}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            aria-label="Filter featured merch"
          >
            <option value="all">All featured states</option>
            <option value="featured">Featured</option>
            <option value="standard">Standard</option>
          </select>
          <select
            value={filters.cause}
            onChange={(event) => onChange('cause', event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            aria-label="Filter by cause"
          >
            <option value="all">All causes</option>
            {options.causes.map((cause) => (
              <option key={cause} value={cause}>
                {cause}
              </option>
            ))}
          </select>
          <select
            value={filters.sort}
            onChange={(event) => onChange('sort', event.target.value as AdminProductFilters['sort'])}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            aria-label="Sort merch products"
          >
            <option value="newest">Recently updated</option>
            <option value="oldest">Oldest updated</option>
            <option value="name">Name</option>
            <option value="price_desc">Highest price</option>
            <option value="inventory_asc">Lowest inventory</option>
            <option value="contribution_desc">Top contribution</option>
          </select>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </section>
  )
}
