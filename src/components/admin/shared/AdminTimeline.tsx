import type { ReactNode } from 'react'

interface AdminTimelineItem {
  id: string
  title: string
  description?: string
  timestamp?: string
  icon?: ReactNode
}

interface AdminTimelineProps {
  items: AdminTimelineItem[]
}

export default function AdminTimeline({ items }: AdminTimelineProps) {
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
            {item.icon ?? <span className="h-2 w-2 rounded-full bg-current" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
            {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
            {item.timestamp && <p className="mt-1 text-xs text-gray-500">{item.timestamp}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
