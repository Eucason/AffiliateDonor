import { Link } from 'react-router-dom'
import { CircleDollarSign, Mail, Package, Shield, UserRound } from 'lucide-react'
import { formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminUserActivity } from '@/types/adminUser'

interface DonorActivityTimelineProps {
  activity: AdminUserActivity[]
}

export default function DonorActivityTimeline({ activity }: DonorActivityTimelineProps) {
  if (activity.length === 0) {
    return <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">No activity has been recorded yet.</p>
  }

  return (
    <ol className="space-y-4">
      {activity.map((event) => (
        <li key={event.id} className="flex gap-3">
          <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            {event.type === 'donation' && <CircleDollarSign className="h-5 w-5" />}
            {event.type === 'purchase' && <Package className="h-5 w-5" />}
            {event.type === 'message' && <Mail className="h-5 w-5" />}
            {event.type === 'profile' && <UserRound className="h-5 w-5" />}
            {event.type === 'role' && <Shield className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{event.label}</p>
            <p className="text-sm text-gray-600">{event.description}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span>{formatAdminDateTime(event.createdAt)}</span>
              {event.sourcePath && (
                <Link to={event.sourcePath} className="font-semibold text-primary-600 hover:text-primary-700">
                  Open source
                </Link>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
