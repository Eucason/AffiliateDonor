import type { ReactNode } from 'react'
import AdminEmptyState from './AdminEmptyState'
import AdminLoadingState from './AdminLoadingState'
import { cn } from '@/utils/cn'

export interface AdminDataTableColumn<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  className?: string
}

interface AdminDataTableProps<T> {
  columns: AdminDataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export default function AdminDataTable<T>({
  columns,
  rows,
  getRowKey,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filters.',
  className,
}: AdminDataTableProps<T>) {
  if (isLoading) {
    return <AdminLoadingState />
  }

  if (rows.length === 0) {
    return <AdminEmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500',
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className="transition hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className={cn('px-5 py-4 text-sm text-gray-700', column.className)}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
