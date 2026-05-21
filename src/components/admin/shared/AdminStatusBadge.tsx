import { getAdminStatusDefinition } from '@/config/adminStatuses'
import { cn } from '@/utils/cn'
import type { AdminStatusTone } from '@/types/admin'

interface AdminStatusBadgeProps {
  status: string
  label?: string
  tone?: AdminStatusTone
  className?: string
}

const toneClasses: Record<AdminStatusTone, string> = {
  gray: 'bg-gray-100 text-gray-700 ring-gray-200',
  green: 'bg-green-100 text-green-700 ring-green-200',
  red: 'bg-red-100 text-red-700 ring-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  blue: 'bg-blue-100 text-blue-700 ring-blue-200',
  purple: 'bg-purple-100 text-purple-700 ring-purple-200',
  primary: 'bg-primary-100 text-primary-700 ring-primary-200',
  secondary: 'bg-secondary-100 text-secondary-700 ring-secondary-200',
}

export default function AdminStatusBadge({
  status,
  label,
  tone,
  className,
}: AdminStatusBadgeProps) {
  const definition = getAdminStatusDefinition(status)
  const badgeTone = tone ?? definition.tone

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        toneClasses[badgeTone],
        className,
      )}
    >
      {label ?? definition.label}
    </span>
  )
}
