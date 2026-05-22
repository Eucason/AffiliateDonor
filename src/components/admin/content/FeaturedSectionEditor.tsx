import type { AdminContentEditorProps } from '@/types/adminContent'

export default function FeaturedSectionEditor({ draft, onFieldChange, onMetadataChange }: AdminContentEditorProps) {
  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Section Copy</span>
        <textarea
          rows={4}
          value={draft.body}
          onChange={(event) => onFieldChange('body', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Featured Items</span>
        <textarea
          rows={5}
          value={arrayValue(draft.metadata.featuredItems).join('\n')}
          onChange={(event) => onMetadataChange('featuredItems', splitLines(event.target.value))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Layout</span>
        <input
          value={String(draft.metadata.layout ?? '')}
          onChange={(event) => onMetadataChange('layout', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
    </div>
  )
}

function arrayValue(value: unknown) {
  return Array.isArray(value) ? value.map(String) : []
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}
