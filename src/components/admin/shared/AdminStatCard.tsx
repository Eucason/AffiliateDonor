import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AdminStatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  helperText?: string
  className?: string
}

export default function AdminStatCard({
  label,
  value,
  icon,
  trend,
  helperText,
  className,
}: AdminStatCardProps) {
  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <div className="rounded-lg bg-primary-50 p-3 text-primary-600">{icon}</div>}
      </div>
      {(trend || helperText) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold',
                trend.direction === 'up' && 'text-green-700',
                trend.direction === 'down' && 'text-red-700',
                trend.direction === 'neutral' && 'text-gray-600',
              )}
            >
              {trend.direction === 'up' && <TrendingUp className="h-4 w-4" />}
              {trend.direction === 'down' && <TrendingDown className="h-4 w-4" />}
              {trend.value}
            </span>
          )}
          {helperText && <span className="text-gray-500">{helperText}</span>}
        </div>
      )}
    </div>
  )
}
