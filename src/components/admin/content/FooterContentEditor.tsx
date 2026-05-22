import type { AdminContentEditorProps } from '@/types/adminContent'

export default function FooterContentEditor({ draft, onFieldChange, onMetadataChange }: AdminContentEditorProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Footer Copy</span>
        <textarea
          rows={4}
          value={draft.body}
          onChange={(event) => onFieldChange('body', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Support Email</span>
        <input
          value={String(draft.metadata.email ?? '')}
          onChange={(event) => onMetadataChange('email', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Phone</span>
        <input
          value={String(draft.metadata.phone ?? '')}
          onChange={(event) => onMetadataChange('phone', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block lg:col-span-2">
        <span className="mb-1 block text-sm font-medium text-gray-700">Address</span>
        <input
          value={String(draft.metadata.address ?? '')}
          onChange={(event) => onMetadataChange('address', event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Link Groups</span>
        <textarea
          rows={4}
          value={arrayValue(draft.metadata.linkGroup).join('\n')}
          onChange={(event) => onMetadataChange('linkGroup', splitLines(event.target.value))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Social Links</span>
        <textarea
          rows={4}
          value={arrayValue(draft.metadata.socialLinks).join('\n')}
          onChange={(event) => onMetadataChange('socialLinks', splitLines(event.target.value))}
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
