import { BarChart3 } from 'lucide-react'
import AdminEmptyState from '@/components/admin/shared/AdminEmptyState'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import { formatAdminCurrency } from '@/utils/adminFormatters'
import type { AdminDonationTrendPoint } from '@/types/adminReport'

interface DonationTrendsChartProps {
  points: AdminDonationTrendPoint[]
}

export default function DonationTrendsChart({ points }: DonationTrendsChartProps) {
  const maxAmount = Math.max(...points.map((point) => point.amount), 0)

  return (
    <AdminSectionCard
      title="Donation Trends"
      description="Daily, weekly, or monthly contribution volume and status mix."
    >
      {points.length === 0 ? (
        <AdminEmptyState
          title="No donation trends in range"
          description="Adjust the date range or donation filters."
          icon={<BarChart3 className="h-6 w-6" />}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex h-64 items-end gap-3 overflow-x-auto border-b border-gray-200 pb-4">
            {points.map((point) => {
              const height = maxAmount > 0 ? Math.max(12, Math.round((point.amount / maxAmount) * 220)) : 12

              return (
                <div key={point.id} className="flex min-w-20 flex-1 flex-col items-center justify-end gap-2">
                  <div className="text-center text-xs font-semibold text-gray-900">
                    {formatAdminCurrency(point.amount, 'USD', 0)}
                  </div>
                  <div
                    className="w-full max-w-16 rounded-t-lg bg-primary-500"
                    style={{ height }}
                    aria-label={`${point.label}: ${formatAdminCurrency(point.amount)}`}
                  />
                  <div className="w-full truncate text-center text-xs text-gray-500">{point.label}</div>
                </div>
              )
            })}
          </div>

          <div className="grid gap-3 text-sm md:grid-cols-3">
            <TrendTotal label="Successful" value={sum(points, 'successfulCount')} className="text-green-700" />
            <TrendTotal label="Pending" value={sum(points, 'pendingCount')} className="text-yellow-700" />
            <TrendTotal label="Failed or refunded" value={sum(points, 'failedOrRefundedCount')} className="text-red-700" />
          </div>
        </div>
      )}
    </AdminSectionCard>
  )
}

function TrendTotal({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${className}`}>{value}</p>
    </div>
  )
}

function sum(points: AdminDonationTrendPoint[], key: keyof Pick<AdminDonationTrendPoint, 'successfulCount' | 'pendingCount' | 'failedOrRefundedCount'>) {
  return points.reduce((total, point) => total + point[key], 0)
}
