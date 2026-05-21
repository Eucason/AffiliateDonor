import { Link } from 'react-router-dom'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import type { AdminDashboardContentItem } from '@/types/adminDashboard'

interface ContentActivityCardProps {
  items: AdminDashboardContentItem[]
}

export default function ContentActivityCard({ items }: ContentActivityCardProps) {
  return (
    <AdminSectionCard
      title="Content Activity"
      description="Recently updated public-facing content."
      actions={
        <Link to="/admin/blogs" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          Manage content
        </Link>
      }
    >
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">{item.type}</p>
            </div>
            <div className="text-right">
              <AdminStatusBadge status={item.status} />
              <p className="mt-2 text-xs text-gray-500">{formatDate(item.updatedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminSectionCard>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}
