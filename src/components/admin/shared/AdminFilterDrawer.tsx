import type { ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import Button from '@/components/atoms/Button'

interface AdminFilterDrawerProps {
  open: boolean
  children: ReactNode
  onClose: () => void
  onApply?: () => void
  onClear?: () => void
}

export default function AdminFilterDrawer({
  open,
  children,
  onClose,
  onApply,
  onClear,
}: AdminFilterDrawerProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {(onClear || onApply) && (
          <footer className="flex justify-end gap-2 border-t border-gray-200 p-4">
            {onClear && (
              <Button type="button" variant="ghost" onClick={onClear}>
                Clear
              </Button>
            )}
            {onApply && (
              <Button type="button" variant="primary" onClick={onApply}>
                Apply
              </Button>
            )}
          </footer>
        )}
      </aside>
    </div>
  )
}
