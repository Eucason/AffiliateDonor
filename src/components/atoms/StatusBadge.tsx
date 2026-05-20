import { cn } from '@/utils/cn'

interface StatusBadgeProps {
  status: 'draft' | 'published'
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium'

  const statusClasses = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
  }

  return (
    <span className={cn(baseClasses, statusClasses[status], className)}>
      {status === 'draft' ? 'Draft' : 'Published'}
    </span>
  )
}