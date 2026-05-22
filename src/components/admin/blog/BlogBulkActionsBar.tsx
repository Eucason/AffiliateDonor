import { Archive, CheckCircle2, Trash2, X } from 'lucide-react'
import Button from '@/components/atoms/Button'

interface BlogBulkActionsBarProps {
  selectedCount: number
  isBusy?: boolean
  onPublish: () => void
  onArchive: () => void
  onDelete: () => void
  onClear: () => void
}

export default function BlogBulkActionsBar({
  selectedCount,
  isBusy,
  onPublish,
  onArchive,
  onDelete,
  onClear,
}: BlogBulkActionsBarProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="sticky top-4 z-10 rounded-lg border border-primary-200 bg-primary-50 p-3 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-primary-900">
          {selectedCount} {selectedCount === 1 ? 'post' : 'posts'} selected
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onPublish} disabled={isBusy} className="gap-2 bg-white">
            <CheckCircle2 className="h-4 w-4" />
            Publish
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onArchive} disabled={isBusy} className="gap-2 bg-white">
            <Archive className="h-4 w-4" />
            Archive
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDelete}
            disabled={isBusy}
            className="gap-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClear} disabled={isBusy} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
