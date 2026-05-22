import { useEffect, useState } from 'react'
import { Archive, CalendarClock, Eye, Save } from 'lucide-react'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import { contentTypeLabels } from '@/services/admin/adminContentAPI'
import type {
  AdminContentBlock,
  AdminContentMetadataValue,
  AdminContentStatus,
  AdminContentType,
} from '@/types/adminContent'
import AnnouncementEditor from './AnnouncementEditor'
import BannerEditor from './BannerEditor'
import FeaturedSectionEditor from './FeaturedSectionEditor'
import FooterContentEditor from './FooterContentEditor'
import HomepageHeroEditor from './HomepageHeroEditor'
import ImpactStoryEditor from './ImpactStoryEditor'
import TestimonialEditor from './TestimonialEditor'

interface ContentBlockEditorProps {
  block: AdminContentBlock
  saving?: boolean
  onSave: (block: AdminContentBlock) => Promise<void>
  onStatusChange: (id: string, status: AdminContentStatus) => Promise<void>
}

type FieldChangeHandler = <Key extends keyof AdminContentBlock>(key: Key, value: AdminContentBlock[Key]) => void

export default function ContentBlockEditor({
  block,
  saving = false,
  onSave,
  onStatusChange,
}: ContentBlockEditorProps) {
  const [draft, setDraft] = useState(block)
  const [previewOpen, setPreviewOpen] = useState(true)

  useEffect(() => {
    setDraft(block)
  }, [block])

  const handleFieldChange = <Key extends keyof AdminContentBlock>(key: Key, value: AdminContentBlock[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleMetadataChange = (key: string, value: AdminContentBlock['metadata'][string]) => {
    setDraft((current) => ({
      ...current,
      metadata: {
        ...current.metadata,
        [key]: value,
      },
    }))
  }

  const handleSave = async () => {
    await onSave(draft)
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">{draft.title}</h2>
            <AdminStatusBadge status={draft.status} />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {contentTypeLabels[draft.type]} in {draft.area.replace('-', ' ')} content
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setPreviewOpen((current) => !current)} className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onStatusChange(draft.id, 'archived')} disabled={saving} className="gap-2">
            <Archive className="h-4 w-4" />
            Archive
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => onStatusChange(draft.id, 'scheduled')} disabled={saving} className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Schedule
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <label className="block lg:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Title</span>
              <input
                value={draft.title}
                onChange={(event) => handleFieldChange('title', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Status</span>
              <select
                value={draft.status}
                onChange={(event) => handleFieldChange('status', event.target.value as AdminContentStatus)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Slug</span>
              <input
                value={draft.slug}
                onChange={(event) => handleFieldChange('slug', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Sort Order</span>
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(event) => handleFieldChange('sortOrder', Number(event.target.value))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Schedule Date</span>
              <input
                type="datetime-local"
                value={toDatetimeLocalValue(draft.scheduledAt)}
                onChange={(event) => handleFieldChange('scheduledAt', event.target.value ? new Date(event.target.value).toISOString() : undefined)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="block lg:col-span-3">
              <span className="mb-1 block text-sm font-medium text-gray-700">Summary</span>
              <textarea
                rows={2}
                value={draft.summary}
                onChange={(event) => handleFieldChange('summary', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
          </div>

          {renderTypeEditor(draft.type, draft, handleFieldChange, handleMetadataChange)}
        </div>

        {previewOpen && (
          <aside className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Preview</p>
            {draft.mediaUrl && <img src={draft.mediaUrl} alt="" className="mt-3 h-36 w-full rounded-lg object-cover" />}
            <h3 className="mt-3 text-lg font-bold text-gray-900">{draft.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{draft.summary}</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">{draft.body}</p>
            {(draft.ctaLabel || draft.linkLabel) && (
              <div className="mt-4 rounded-lg bg-white p-3 text-sm text-gray-700">
                <span className="font-semibold">{draft.ctaLabel || draft.linkLabel}</span>
                <span className="ml-2 text-gray-500">{draft.ctaTarget || draft.linkTarget}</span>
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  )
}

function renderTypeEditor(
  type: AdminContentType,
  draft: AdminContentBlock,
  onFieldChange: FieldChangeHandler,
  onMetadataChange: (key: string, value: AdminContentMetadataValue) => void,
) {
  const props = { draft, onFieldChange, onMetadataChange }

  switch (type) {
    case 'homepage_hero':
      return <HomepageHeroEditor {...props} />
    case 'announcement':
      return <AnnouncementEditor {...props} />
    case 'banner':
      return <BannerEditor {...props} />
    case 'impact_story':
      return <ImpactStoryEditor {...props} />
    case 'testimonial':
      return <TestimonialEditor {...props} />
    case 'footer_group':
      return <FooterContentEditor {...props} />
    case 'featured_section':
      return <FeaturedSectionEditor {...props} />
    case 'about_section':
    default:
      return (
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Section Body</span>
          <textarea
            rows={8}
            value={draft.body}
            onChange={(event) => onFieldChange('body', event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>
      )
  }
}

function toDatetimeLocalValue(value?: string) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 16)
}
