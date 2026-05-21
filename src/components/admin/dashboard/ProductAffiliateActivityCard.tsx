import { Link } from 'react-router-dom'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import type { AdminDashboardProductActivity } from '@/types/adminDashboard'

interface ProductAffiliateActivityCardProps {
  activity: AdminDashboardProductActivity[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function ProductAffiliateActivityCard({ activity }: ProductAffiliateActivityCardProps) {
  return (
    <AdminSectionCard
      title="Product & Affiliate Activity"
      description="Clicks, conversions, and estimated contribution value."
      actions={
        <Link to="/admin/products/affiliate" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          View products
        </Link>
      }
    >
      <div className="space-y-4">
        {activity.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-100 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.type}</p>
              </div>
              <p className="font-bold text-gray-900">{currencyFormatter.format(item.estimatedContribution)}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-xs text-gray-500">Clicks</p>
                <p className="font-semibold text-gray-900">{item.clicks.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <p className="text-xs text-gray-500">Conversions</p>
                <p className="font-semibold text-gray-900">{item.conversions.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminSectionCard>
  )
}
