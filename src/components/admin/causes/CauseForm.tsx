import { useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Save } from 'lucide-react'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import Button from '@/components/atoms/Button'
import CauseFeaturedToggle from './CauseFeaturedToggle'
import { emptyCauseFormData } from '@/services/admin/adminCausesAPI'
import type { AdminCauseFormData, AdminCauseStatus } from '@/types/adminCause'

interface CauseFormProps {
  initialValue?: AdminCauseFormData
  submitLabel: string
  onSubmit: (formData: AdminCauseFormData) => Promise<void>
}

type FormErrors = Partial<Record<keyof AdminCauseFormData, string>>

const statuses: Array<{ value: AdminCauseStatus; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending review' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
]

const categories = ['Environment', 'Education', 'Health', 'Humanitarian', 'Community', 'Animals']

export default function CauseForm({ initialValue, submitLabel, onSubmit }: CauseFormProps) {
  const [formData, setFormData] = useState<AdminCauseFormData>(initialValue ?? emptyCauseFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const progressPreview = useMemo(() => {
    const goal = Number(formData.goal)
    return Number.isFinite(goal) && goal > 0 ? 'Ready for funding progress tracking' : 'Enter a goal to enable progress tracking'
  }, [formData.goal])

  const updateField = <Key extends keyof AdminCauseFormData>(key: Key, value: AdminCauseFormData[Key]) => {
    setFormData((current) => ({
      ...current,
      [key]: value,
      slug: key === 'name' && !current.slug ? slugify(String(value)) : current.slug,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSaving(true)
    try {
      await onSubmit(formData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminSectionCard title="Campaign Basics">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Name" error={errors.name}>
            <input
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
              className={inputClasses(Boolean(errors.name))}
            />
          </Field>
          <Field label="Slug" error={errors.slug}>
            <input
              value={formData.slug}
              onChange={(event) => updateField('slug', slugify(event.target.value))}
              className={inputClasses(Boolean(errors.slug))}
            />
          </Field>
          <Field label="Category">
            <select
              value={formData.category}
              onChange={(event) => updateField('category', event.target.value)}
              className={inputClasses(false)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Location" error={errors.location}>
            <input
              value={formData.location}
              onChange={(event) => updateField('location', event.target.value)}
              className={inputClasses(Boolean(errors.location))}
            />
          </Field>
          <Field label="Goal" error={errors.goal}>
            <input
              type="number"
              min="0"
              value={formData.goal}
              onChange={(event) => updateField('goal', event.target.value)}
              className={inputClasses(Boolean(errors.goal))}
            />
          </Field>
          <Field label="Status">
            <select
              value={formData.status}
              onChange={(event) => updateField('status', event.target.value as AdminCauseStatus)}
              className={inputClasses(false)}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="mt-4 text-sm text-gray-500">{progressPreview}</p>
      </AdminSectionCard>

      <AdminSectionCard title="Story And Impact">
        <div className="space-y-4">
          <Field label="Description" error={errors.description}>
            <textarea
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
              className={`${inputClasses(Boolean(errors.description))} min-h-32 py-3`}
            />
          </Field>
          <Field label="Impact metric" error={errors.impactMetric}>
            <input
              value={formData.impactMetric}
              onChange={(event) => updateField('impactMetric', event.target.value)}
              className={inputClasses(Boolean(errors.impactMetric))}
            />
          </Field>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Dates And Media">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Start date">
            <input
              type="date"
              value={formData.startDate}
              onChange={(event) => updateField('startDate', event.target.value)}
              className={inputClasses(false)}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              value={formData.endDate}
              onChange={(event) => updateField('endDate', event.target.value)}
              className={inputClasses(false)}
            />
          </Field>
          <Field label="Main image URL" error={errors.mainImage}>
            <input
              value={formData.mainImage}
              onChange={(event) => updateField('mainImage', event.target.value)}
              className={inputClasses(Boolean(errors.mainImage))}
            />
          </Field>
          <Field label="Gallery image URLs">
            <textarea
              value={formData.galleryImages}
              onChange={(event) => updateField('galleryImages', event.target.value)}
              placeholder="One URL per line"
              className={`${inputClasses(false)} min-h-24 py-3`}
            />
          </Field>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Publishing Controls">
        <div className="grid gap-4 lg:grid-cols-2">
          <CauseFeaturedToggle
            checked={formData.featured}
            label="Feature this campaign"
            description="Show as a highlighted campaign in admin and future content surfaces."
            onChange={(checked) => updateField('featured', checked)}
          />
          <CauseFeaturedToggle
            checked={formData.verified}
            label="Verified campaign"
            description="Mark the campaign as reviewed by the admin team."
            onChange={(checked) => updateField('verified', checked)}
          />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="SEO">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="SEO title">
            <input
              value={formData.seoTitle}
              onChange={(event) => updateField('seoTitle', event.target.value)}
              className={inputClasses(false)}
            />
          </Field>
          <Field label="SEO description">
            <textarea
              value={formData.seoDescription}
              onChange={(event) => updateField('seoDescription', event.target.value)}
              className={`${inputClasses(false)} min-h-24 py-3`}
            />
          </Field>
        </div>
      </AdminSectionCard>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" isLoading={saving}>
          <Save className="mr-2 h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  )
}

function validateForm(formData: AdminCauseFormData) {
  const errors: FormErrors = {}

  if (!formData.name.trim()) {
    errors.name = 'Campaign name is required.'
  }

  if (!formData.slug.trim()) {
    errors.slug = 'Slug is required.'
  }

  if (!formData.location.trim()) {
    errors.location = 'Location is required.'
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required.'
  }

  if (!formData.impactMetric.trim()) {
    errors.impactMetric = 'Impact metric is required.'
  }

  const goal = Number(formData.goal)
  if (!formData.goal || Number.isNaN(goal) || goal <= 0) {
    errors.goal = 'Goal must be greater than zero.'
  }

  if (!formData.mainImage.trim()) {
    errors.mainImage = 'Main image URL is required until media library upload is connected.'
  }

  return errors
}

function inputClasses(hasError: boolean) {
  return [
    'h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none transition focus:ring-2',
    hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100',
  ].join(' ')
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
