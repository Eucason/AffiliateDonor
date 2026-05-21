import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AdminLoadingStateProps {
  label?: string
  className?: string
}

export default function AdminLoadingState({
  label = 'Loading admin data...',
  className,
}: AdminLoadingStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-40 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-sm text-gray-600',
        className,
      )}
    >
      <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-600" />
      {label}
    </div>
  )
}
