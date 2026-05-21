import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminDashboardPendingAction } from '@/types/adminDashboard'

interface PendingActionsCardProps {
  actions: AdminDashboardPendingAction[]
}

export default function PendingActionsCard({ actions }: PendingActionsCardProps) {
  return (
    <AdminSectionCard title="Pending Actions" description="Items that need admin review.">
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.path}
            className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition hover:border-primary-200 hover:bg-primary-50"
          >
            <span className="flex min-w-0 items-center gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
              <span className="truncate text-sm font-medium text-gray-800">{action.label}</span>
            </span>
            <span className="ml-3 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-800">
              {action.count}
            </span>
          </Link>
        ))}
      </div>
    </AdminSectionCard>
  )
}
