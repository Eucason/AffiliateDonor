import type { AdminProductFormData } from '@/types/adminProduct'

interface MerchProductFormProps {
  formData: AdminProductFormData
  onChange: <Key extends keyof AdminProductFormData>(key: Key, value: AdminProductFormData[Key]) => void
}

export default function MerchProductForm({ formData, onChange }: MerchProductFormProps) {
  if (formData.type !== 'merch') {
    return null
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">SKU</span>
        <input
          value={formData.sku}
          onChange={(event) => onChange('sku', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Profit Allocation Percent</span>
        <input
          type="number"
          value={formData.allocationPercent}
          onChange={(event) => onChange('allocationPercent', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Inventory Quantity</span>
        <input
          type="number"
          value={formData.inventoryQuantity}
          onChange={(event) => onChange('inventoryQuantity', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Low Stock Threshold</span>
        <input
          type="number"
          value={formData.lowStockThreshold}
          onChange={(event) => onChange('lowStockThreshold', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Variants</span>
        <textarea
          rows={4}
          value={formData.variants}
          onChange={(event) => onChange('variants', event.target.value)}
          placeholder="Small|AD-TEE-S|48"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
        <p className="mt-1 text-xs text-gray-500">One variant per line: name|sku|inventory</p>
      </label>
    </div>
  )
}
