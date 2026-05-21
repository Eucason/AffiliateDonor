import { FileText, HeartHandshake, Mail, PlusCircle, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'

const quickActions = [
  {
    label: 'Create campaign',
    path: '/admin/causes/new',
    icon: Target,
  },
  {
    label: 'New blog post',
    path: '/admin/blogs/new',
    icon: FileText,
  },
  {
    label: 'Review donations',
    path: '/admin/donations',
    icon: HeartHandshake,
  },
  {
    label: 'Open messages',
    path: '/admin/messages',
    icon: Mail,
  },
]

export default function QuickActionsCard() {
  return (
    <AdminSectionCard title="Quick Actions" description="Common admin workflows.">
      <div className="grid gap-3 sm:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon

          return (
            <Link
              key={action.path}
              to={action.path}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm font-semibold text-gray-800 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Icon className="h-5 w-5" />
              </span>
              {action.label}
            </Link>
          )
        })}
      </div>
      <Link
        to="/admin/reports"
        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        <PlusCircle className="h-4 w-4" />
        View reports
      </Link>
    </AdminSectionCard>
  )
}
