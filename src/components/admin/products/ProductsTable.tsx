import { Archive, Copy, Edit, Eye, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { isLowStock, isOutOfStock } from '@/services/admin/adminProductsAPI'
import type { AdminProduct, AdminProductStatus } from '@/types/adminProduct'

interface ProductsTableProps {
  products: AdminProduct[]
  busy?: boolean
  onStatusChange: (id: string, status: AdminProductStatus) => void
  onDelete: (id: string) => void
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function ProductsTable({ products, busy, onStatusChange, onDelete }: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Cause</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Performance</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Inventory</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="min-w-[22rem] px-4 py-4">
                  <div className="flex gap-3">
                    <img src={product.imageUrl} alt="" className="h-16 w-20 rounded-lg object-cover" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/admin/products/${product.id}/edit`} className="font-semibold text-gray-900 hover:text-primary-700">
                          {product.name}
                        </Link>
                        {product.featured && <Star className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{product.brand} - {product.categoryName}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{currencyFormatter.format(product.price)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="space-y-2">
                    <AdminStatusBadge status={product.status} />
                    <AdminStatusBadge status={product.type} label={product.type} tone={product.type === 'merch' ? 'purple' : 'blue'} />
                  </div>
                </td>
                <td className="px-4 py-4 align-top">
                  <p className="text-sm font-medium text-gray-900">{product.linkedCauseName}</p>
                  <p className="text-xs text-gray-500">{product.allocationPercent}% allocation</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <p className="text-sm font-semibold text-gray-900">{product.clickCount.toLocaleString()} clicks</p>
                  <p className="text-xs text-gray-500">{product.conversionCount.toLocaleString()} conversions</p>
                  <p className="text-xs text-gray-500">{currencyFormatter.format(product.estimatedContribution)} est.</p>
                </td>
                <td className="px-4 py-4 align-top">
                  {product.type === 'merch' ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{product.inventoryQuantity ?? 0} units</p>
                      {(isLowStock(product) || isOutOfStock(product)) && (
                        <p className="text-xs font-medium text-yellow-700">{isOutOfStock(product) ? 'Out of stock' : 'Low stock'}</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Not tracked</span>
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="flex items-center justify-end gap-1">
                    {product.affiliateUrl && (
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(product.affiliateUrl ?? '')}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title="Copy affiliate URL"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                    <Link to={`/admin/products/${product.id}/edit`} className="rounded-lg p-2 text-primary-600 hover:bg-primary-50 hover:text-primary-800" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Link>
                    {product.status !== 'published' && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => onStatusChange(product.id, 'published')} disabled={busy}>
                        Publish
                      </Button>
                    )}
                    {product.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(product.id, 'archived')}
                        disabled={busy}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      disabled={busy}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link to={`/admin/products/${product.id}/edit`} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 hover:text-blue-800" title="View performance">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
