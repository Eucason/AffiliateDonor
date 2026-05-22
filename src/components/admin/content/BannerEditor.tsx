import type { AdminContentEditorProps } from '@/types/adminContent'

export default function BannerEditor({ draft, onFieldChange, onMetadataChange }: AdminContentEditorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Banner Message</span>
        <textarea
          rows={4}
          value={draft.body}
          onChange={(event) => onFieldChange('body', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Link Label</span>
        <input
          value={draft.linkLabel ?? ''}
          onChange={(event) => onFieldChange('linkLabel', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Link Target</span>
        <input
          value={draft.linkTarget ?? ''}
          onChange={(event) => onFieldChange('linkTarget', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Start Date</span>
        <input
          type="date"
          value={draft.startAt?.slice(0, 10) ?? ''}
          onChange={(event) => onFieldChange('startAt', event.target.value ? new Date(event.target.value).toISOString() : undefined)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">End Date</span>
        <input
          type="date"
          value={draft.endAt?.slice(0, 10) ?? ''}
          onChange={(event) => onFieldChange('endAt', event.target.value ? new Date(event.target.value).toISOString() : undefined)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Placement</span>
        <input
          value={String(draft.metadata.placement ?? '')}
          onChange={(event) => onMetadataChange('placement', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Visual Theme</span>
        <input
          value={String(draft.metadata.colorTheme ?? draft.metadata.severity ?? '')}
          onChange={(event) => onMetadataChange(draft.type === 'announcement' ? 'severity' : 'colorTheme', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
    </div>
  )
}
