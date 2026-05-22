import type { AdminProductFormData } from '@/types/adminProduct'

interface AffiliateProductFormProps {
  formData: AdminProductFormData
  onChange: <Key extends keyof AdminProductFormData>(key: Key, value: AdminProductFormData[Key]) => void
}

export default function AffiliateProductForm({ formData, onChange }: AffiliateProductFormProps) {
  if (formData.type !== 'affiliate') {
    return null
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Affiliate URL</span>
        <input
          type="url"
          value={formData.affiliateUrl}
          onChange={(event) => onChange('affiliateUrl', event.target.value)}
          placeholder="https://partner.example/product"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Click Tracking Label</span>
        <input
          value={`${formData.slug || 'product'}-affiliate`}
          readOnly
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Donation Percent</span>
        <input
          type="number"
          value={formData.allocationPercent}
          onChange={(event) => onChange('allocationPercent', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
    </div>
  )
}
