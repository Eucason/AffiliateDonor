import { X } from 'lucide-react'
import Button from '@/components/atoms/Button'
import { useAdminMedia } from '@/hooks/admin/useAdminMedia'
import type { AdminMediaAsset } from '@/types/adminMedia'
import MediaLibraryGrid from './MediaLibraryGrid'

interface MediaPickerDialogProps {
  open: boolean
  selectedId?: string | null
  title?: string
  onSelect: (asset: AdminMediaAsset) => void
  onClose: () => void
}

export default function MediaPickerDialog({
  open,
  selectedId,
  title = 'Select media',
  onSelect,
  onClose,
}: MediaPickerDialogProps) {
  const { filteredAssets, filters, loading, updateFilter } = useAdminMedia({ type: 'image' })

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">Choose an image asset from the admin media library.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close media picker"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b border-gray-200 p-4">
          <input
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder="Search title, filename, alt text, or tags"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">Loading media assets...</div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">No matching media assets.</div>
          ) : (
            <MediaLibraryGrid
              assets={filteredAssets}
              selectedId={selectedId}
              selectable
              onSelect={(asset) => {
                onSelect(asset)
                onClose()
              }}
            />
          )}
        </div>

        <footer className="flex justify-end border-t border-gray-200 px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </section>
    </div>
  )
}
