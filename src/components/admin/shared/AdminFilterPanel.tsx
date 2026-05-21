import type { ReactNode } from 'react'
import Button from '@/components/atoms/Button'

interface AdminFilterPanelProps {
  children: ReactNode
  onClear?: () => void
  onApply?: () => void
}

export default function AdminFilterPanel({ children, onClear, onApply }: AdminFilterPanelProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>
      {(onClear || onApply) && (
        <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
          {onClear && (
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          )}
          {onApply && (
            <Button type="button" variant="primary" size="sm" onClick={onApply}>
              Apply Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
