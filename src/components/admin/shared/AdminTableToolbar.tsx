import type { ReactNode } from 'react'

interface AdminTableToolbarProps {
  title?: string
  description?: string
  searchSlot?: ReactNode
  filterSlot?: ReactNode
  actions?: ReactNode
}

export default function AdminTableToolbar({
  title,
  description,
  searchSlot,
  filterSlot,
  actions,
}: AdminTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h2 className="text-base font-semibold text-gray-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      {(searchSlot || filterSlot) && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {searchSlot && <div className="min-w-0 flex-1">{searchSlot}</div>}
          {filterSlot && <div className="flex flex-wrap items-center gap-2">{filterSlot}</div>}
        </div>
      )}
    </div>
  )
}
