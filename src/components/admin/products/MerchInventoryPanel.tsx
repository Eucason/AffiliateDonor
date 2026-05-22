import { AlertTriangle, PackageCheck } from 'lucide-react'
import Button from '@/components/atoms/Button'
import { isLowStock, isOutOfStock } from '@/services/admin/adminProductsAPI'
import type { AdminProduct } from '@/types/adminProduct'

interface MerchInventoryPanelProps {
  product: AdminProduct
  value: string
  busy?: boolean
  onChange: (value: string) => void
  onSave: () => void
}

export default function MerchInventoryPanel({ product, value, busy, onChange, onSave }: MerchInventoryPanelProps) {
  if (product.type !== 'merch') {
    return null
  }

  const lowStock = isLowStock(product)
  const outOfStock = isOutOfStock(product)

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Inventory</h2>
          <p className="mt-1 text-sm text-gray-600">Update stock counts and review variant inventory.</p>
        </div>
        {(lowStock || outOfStock) && (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-yellow-200">
            <AlertTriangle className="h-3 w-3" />
            {outOfStock ? 'Out of stock' : 'Low stock'}
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Inventory Quantity</span>
          <input
            type="number"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>
        <Button type="button" variant="primary" onClick={onSave} disabled={busy} className="self-end gap-2">
          <PackageCheck className="h-4 w-4" />
          Update
        </Button>
      </div>

      {product.variants.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Variants</p>
          {product.variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
              <div>
                <p className="font-medium text-gray-900">{variant.name}</p>
                <p className="text-xs text-gray-500">{variant.sku}</p>
              </div>
              <span className="font-semibold text-gray-800">{variant.inventoryQuantity}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
