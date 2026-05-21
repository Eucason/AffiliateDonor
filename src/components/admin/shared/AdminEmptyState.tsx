import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

interface AdminEmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
  className?: string
}

export default function AdminEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-gray-600">{description}</p>}
      {actionLabel && onAction && (
        <Button type="button" variant="primary" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
