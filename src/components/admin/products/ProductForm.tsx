import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Save, Sparkles } from 'lucide-react'
import Button from '@/components/atoms/Button'
import AffiliateProductForm from './AffiliateProductForm'
import MerchProductForm from './MerchProductForm'
import { emptyProductFormData, generateProductSlug } from '@/services/admin/adminProductsAPI'
import type { AdminProductCategory, AdminProductFormData, AdminProductStatus, AdminProductType } from '@/types/adminProduct'

interface ProductFormProps {
  initialData: AdminProductFormData
  categories: AdminProductCategory[]
  submitLabel: string
  isSubmitting?: boolean
  onSubmit: (formData: AdminProductFormData) => Promise<void> | void
}

const productStatuses: AdminProductStatus[] = ['draft', 'published', 'disabled', 'archived']

export default function ProductForm({
  initialData,
  categories,
  submitLabel,
  isSubmitting,
  onSubmit,
}: ProductFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const categoryOptions = useMemo(
    () => categories.filter((category) => category.type === 'all' || category.type === formData.type),
    [categories, formData.type],
  )

  const updateField = <Key extends keyof AdminProductFormData>(key: Key, value: AdminProductFormData[Key]) => {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  const updateType = (type: AdminProductType) => {
    setFormData((current) => {
      const defaults = emptyProductFormData(type)
      const nextCategory = categories.find((category) => category.type === type || category.type === 'all')

      return {
        ...current,
        type,
        brand: type === 'merch' && !current.brand ? defaults.brand : current.brand,
        sku: type === 'merch' ? current.sku : '',
        affiliateUrl: type === 'affiliate' ? current.affiliateUrl : '',
        inventoryQuantity: type === 'merch' ? current.inventoryQuantity || defaults.inventoryQuantity : '',
        lowStockThreshold: type === 'merch' ? current.lowStockThreshold || defaults.lowStockThreshold : '',
        variants: type === 'merch' ? current.variants : '',
        allocationPercent: current.allocationPercent || defaults.allocationPercent,
        categoryId: nextCategory?.id ?? defaults.categoryId,
        categoryName: nextCategory?.name ?? defaults.categoryName,
      }
    })
  }

  const updateCategory = (categoryId: string) => {
    const category = categories.find((item) => item.id === categoryId)
    setFormData((current) => ({
      ...current,
      categoryId,
      categoryName: category?.name ?? current.categoryName,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const error = validateProductForm(formData)
    if (error) {
      setValidationError(error)
      return
    }

    setValidationError(null)
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {validationError}
        </div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Product Details</h2>
            <p className="mt-1 text-sm text-gray-600">Core product metadata used by the admin list, shop surfaces, and reports.</p>
          </div>
          <div className="inline-flex w-full rounded-lg border border-gray-200 bg-gray-50 p-1 md:w-auto">
            {(['affiliate', 'merch'] as AdminProductType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateType(type)}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold capitalize transition md:flex-none ${
                  formData.type === type ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
            <input
              value={formData.name}
              onChange={(event) => {
                const name = event.target.value
                setFormData((current) => ({
                  ...current,
                  name,
                  slug: current.slug ? current.slug : generateProductSlug(name),
                }))
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Slug</span>
            <div className="flex gap-2">
              <input
                value={formData.slug}
                onChange={(event) => updateField('slug', generateProductSlug(event.target.value))}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={() => updateField('slug', generateProductSlug(formData.name))}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                title="Generate slug"
              >
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Brand</span>
            <input
              value={formData.brand}
              onChange={(event) => updateField('brand', event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Price</span>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(event) => updateField('price', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Currency</span>
              <input
                value={formData.currency}
                onChange={(event) => updateField('currency', event.target.value.toUpperCase())}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Category</span>
            <select
              value={formData.categoryId}
              onChange={(event) => updateCategory(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Status</span>
            <select
              value={formData.status}
              onChange={(event) => updateField('status', event.target.value as AdminProductStatus)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm capitalize focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              {productStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Linked Cause ID</span>
            <input
              value={formData.linkedCauseId}
              onChange={(event) => updateField('linkedCauseId', event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Linked Cause Name</span>
            <input
              value={formData.linkedCauseName}
              onChange={(event) => updateField('linkedCauseName', event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">Primary Image URL</span>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(event) => updateField('imageUrl', event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">Gallery Images</span>
            <textarea
              rows={3}
              value={formData.galleryImages}
              onChange={(event) => updateField('galleryImages', event.target.value)}
              placeholder="One image URL per line"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">Description</span>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </label>

          <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 lg:col-span-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(event) => updateField('featured', event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Feature this product in admin merchandising and public promotion slots.</span>
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{formData.type === 'affiliate' ? 'Affiliate Tracking' : 'Merch Inventory'}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {formData.type === 'affiliate'
            ? 'Configure external destination, tracking label, and estimated donation percentage.'
            : 'Configure SKU, stock thresholds, and variant inventory for merchandise.'}
        </p>
        <div className="mt-5">
          <AffiliateProductForm formData={formData} onChange={updateField} />
          <MerchProductForm formData={formData} onChange={updateField} />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function validateProductForm(formData: AdminProductFormData) {
  if (!formData.name.trim()) {
    return 'Product name is required.'
  }
  if (!formData.brand.trim()) {
    return 'Brand is required.'
  }
  if (!formData.slug.trim()) {
    return 'Slug is required.'
  }
  if (!formData.categoryId.trim()) {
    return 'Category is required.'
  }
  if (!formData.linkedCauseName.trim()) {
    return 'Linked cause name is required.'
  }
  if (!formData.description.trim()) {
    return 'Description is required.'
  }
  if (!formData.imageUrl.trim() || !isValidUrl(formData.imageUrl)) {
    return 'A valid primary image URL is required.'
  }
  if (!Number.isFinite(Number(formData.price)) || Number(formData.price) <= 0) {
    return 'Price must be greater than zero.'
  }
  if (!Number.isFinite(Number(formData.allocationPercent)) || Number(formData.allocationPercent) < 0) {
    return 'Allocation percent must be zero or greater.'
  }
  if (formData.type === 'affiliate' && (!formData.affiliateUrl.trim() || !isValidUrl(formData.affiliateUrl))) {
    return 'A valid affiliate URL is required.'
  }
  if (formData.type === 'merch' && !formData.sku.trim()) {
    return 'SKU is required for merchandise products.'
  }
  return null
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
