import type { AdminContentEditorProps } from '@/types/adminContent'

export default function TestimonialEditor({ draft, onFieldChange, onMetadataChange }: AdminContentEditorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Name</span>
        <input
          value={draft.title}
          onChange={(event) => onFieldChange('title', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Role or Context</span>
        <input
          value={String(draft.metadata.role ?? '')}
          onChange={(event) => onMetadataChange('role', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Quote</span>
        <textarea
          rows={5}
          value={draft.body}
          onChange={(event) => onFieldChange('body', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Organization</span>
        <input
          value={String(draft.metadata.organization ?? '')}
          onChange={(event) => onMetadataChange('organization', event.target.value)}
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
