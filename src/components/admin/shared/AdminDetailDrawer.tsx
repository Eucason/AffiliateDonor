import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface AdminDetailDrawerProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export default function AdminDetailDrawer({
  open,
  title,
  children,
  onClose,
}: AdminDetailDrawerProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <aside className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="p-5">{children}</div>
      </aside>
    </div>
  )
}
