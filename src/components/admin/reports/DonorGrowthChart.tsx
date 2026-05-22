import { Users } from 'lucide-react'
import AdminEmptyState from '@/components/admin/shared/AdminEmptyState'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import { formatAdminCurrency } from '@/utils/adminFormatters'
import type { AdminDonorGrowthPoint } from '@/types/adminReport'

interface DonorGrowthChartProps {
  points: AdminDonorGrowthPoint[]
}

export default function DonorGrowthChart({ points }: DonorGrowthChartProps) {
  const maxDonors = Math.max(...points.map((point) => point.totalDonors), 0)

  return (
    <AdminSectionCard
      title="Donor Growth"
      description="New donors, returning donors, total donor base, and average donation trend."
    >
      {points.length === 0 ? (
        <AdminEmptyState
          title="No donor growth in range"
          description="Adjust the date range to include donor signup activity."
          icon={<Users className="h-6 w-6" />}
        />
      ) : (
        <div className="space-y-5">
          <div className="space-y-3">
            {points.map((point) => {
              const width = maxDonors > 0 ? Math.max(8, Math.round((point.totalDonors / maxDonors) * 100)) : 8

              return (
                <div key={point.id} className="grid gap-2 md:grid-cols-[9rem_minmax(0,1fr)_8rem] md:items-center">
                  <div className="text-sm font-medium text-gray-700">{point.label}</div>
                  <div className="h-9 rounded-lg bg-gray-100">
                    <div
                      className="flex h-9 items-center rounded-lg bg-secondary-500 px-3 text-xs font-semibold text-white"
                      style={{ width: `${width}%` }}
                    >
                      {point.totalDonors}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{formatAdminCurrency(point.averageDonation, 'USD', 0)} avg</div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Metric label="New donors" value={points.reduce((total, point) => total + point.newDonors, 0)} />
            <Metric label="Returning donors" value={points.reduce((total, point) => total + point.returningDonors, 0)} />
            <Metric label="Current donor base" value={points[points.length - 1]?.totalDonors ?? 0} />
          </div>
        </div>
      )}
    </AdminSectionCard>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
