import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface AdminSectionCardProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export default function AdminSectionCard({
  title,
  description,
  actions,
  children,
  className,
}: AdminSectionCardProps) {
  return (
    <section className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h2 className="text-base font-semibold text-gray-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}
