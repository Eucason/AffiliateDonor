import type { ReactNode } from 'react'

interface AdminBulkActionsBarProps {
  selectedCount: number
  actions: ReactNode
}

export default function AdminBulkActionsBar({ selectedCount, actions }: AdminBulkActionsBarProps) {
  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-primary-800">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </p>
      <div className="flex flex-wrap items-center gap-2">{actions}</div>
    </div>
  )
}
