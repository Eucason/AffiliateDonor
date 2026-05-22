import type { AdminContentEditorProps } from '@/types/adminContent'

export default function ImpactStoryEditor({ draft, onFieldChange, onMetadataChange }: AdminContentEditorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Story Text</span>
        <textarea
          rows={6}
          value={draft.body}
          onChange={(event) => onFieldChange('body', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Impact Metric</span>
        <input
          value={String(draft.metadata.impactMetric ?? '')}
          onChange={(event) => onMetadataChange('impactMetric', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Location</span>
        <input
          value={String(draft.metadata.location ?? '')}
          onChange={(event) => onMetadataChange('location', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Linked Campaign</span>
        <input
          value={draft.linkedEntityLabel ?? ''}
          onChange={(event) => onFieldChange('linkedEntityLabel', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Image URL</span>
        <input
          value={draft.mediaUrl ?? ''}
          onChange={(event) => onFieldChange('mediaUrl', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
    </div>
  )
}
