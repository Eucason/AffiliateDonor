import { AlertCircle, HeartHandshake, Target, Users } from 'lucide-react'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import type { AdminDashboardMetric } from '@/types/adminDashboard'

interface DashboardKpiGridProps {
  metrics: AdminDashboardMetric[]
}

const icons = [HeartHandshake, Users, Target, AlertCircle]

export default function DashboardKpiGrid({ metrics }: DashboardKpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = icons[index] ?? HeartHandshake

        return (
          <AdminStatCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            helperText={metric.helperText}
            trend={metric.trend}
            icon={<Icon className="h-6 w-6" />}
          />
        )
      })}
    </div>
  )
}
