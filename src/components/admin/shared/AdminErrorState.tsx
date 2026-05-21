import { AlertTriangle } from 'lucide-react'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

interface AdminErrorStateProps {
  title?: string
  message: string
  retryLabel?: string
  onRetry?: () => void
  className?: string
}

export default function AdminErrorState({
  title = 'Something went wrong',
  message,
  retryLabel = 'Try again',
  onRetry,
  className,
}: AdminErrorStateProps) {
  return (
    <div className={cn('rounded-lg border border-red-200 bg-red-50 p-5', className)}>
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
        <div>
          <h3 className="text-sm font-semibold text-red-900">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
