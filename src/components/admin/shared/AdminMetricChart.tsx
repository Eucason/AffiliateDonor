import { BarChart3 } from 'lucide-react'
import AdminSectionCard from './AdminSectionCard'

interface AdminMetricChartProps {
  title: string
  description?: string
}

export default function AdminMetricChart({ title, description }: AdminMetricChartProps) {
  return (
    <AdminSectionCard title={title} description={description}>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-500">
        <div className="text-center">
          <BarChart3 className="mx-auto mb-2 h-8 w-8" />
          <p className="text-sm font-medium">Chart area</p>
        </div>
      </div>
    </AdminSectionCard>
  )
}
