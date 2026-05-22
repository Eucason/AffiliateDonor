import type { AdminContentEditorProps } from '@/types/adminContent'

export default function HomepageHeroEditor({ draft, onFieldChange, onMetadataChange }: AdminContentEditorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Eyebrow</span>
        <input
          value={String(draft.metadata.eyebrow ?? '')}
          onChange={(event) => onMetadataChange('eyebrow', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Headline</span>
        <input
          value={draft.title}
          onChange={(event) => onFieldChange('title', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Supporting Text</span>
        <textarea
          rows={4}
          value={draft.body}
          onChange={(event) => onFieldChange('body', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Primary CTA Label</span>
        <input
          value={draft.ctaLabel ?? ''}
          onChange={(event) => onFieldChange('ctaLabel', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Primary CTA Target</span>
        <input
          value={draft.ctaTarget ?? ''}
          onChange={(event) => onFieldChange('ctaTarget', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Secondary CTA Label</span>
        <input
          value={String(draft.metadata.secondaryCtaLabel ?? '')}
          onChange={(event) => onMetadataChange('secondaryCtaLabel', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Secondary CTA Target</span>
        <input
          value={String(draft.metadata.secondaryCtaTarget ?? '')}
          onChange={(event) => onMetadataChange('secondaryCtaTarget', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Background Media URL</span>
        <input
          value={draft.mediaUrl ?? ''}
          onChange={(event) => onFieldChange('mediaUrl', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
    </div>
  )
}
