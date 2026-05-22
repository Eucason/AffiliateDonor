import { MapPin, Users } from 'lucide-react'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { formatAdminCurrency } from '@/utils/adminFormatters'
import type { AdminCause } from '@/types/adminCause'

interface CauseProgressCardProps {
  cause: AdminCause
}

export default function CauseProgressCard({ cause }: CauseProgressCardProps) {
  const progress = getProgress(cause)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{cause.name}</h3>
            <AdminStatusBadge status={cause.status} />
          </div>
          <p className="mt-1 text-sm text-gray-600">{cause.impactMetric}</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {formatAdminCurrency(cause.raised, cause.currency, 0)}
        </p>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-gray-700">{progress}% funded</span>
          <span className="text-gray-500">{formatAdminCurrency(cause.goal, cause.currency, 0)} goal</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-primary-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
        <span className="inline-flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          {cause.supporters.toLocaleString()} supporters
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          {cause.location}
        </span>
      </div>
    </div>
  )
}

function getProgress(cause: AdminCause) {
  if (cause.goal <= 0) {
    return 0
  }

  return Math.min(100, Math.round((cause.raised / cause.goal) * 100))
}
