import { BarChart3, MousePointerClick, Percent, TrendingUp } from 'lucide-react'
import type { AdminProduct } from '@/types/adminProduct'

interface ProductPerformanceCardProps {
  products: AdminProduct[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function ProductPerformanceCard({ products }: ProductPerformanceCardProps) {
  const clicks = products.reduce((total, product) => total + product.clickCount, 0)
  const conversions = products.reduce((total, product) => total + product.conversionCount, 0)
  const contribution = products.reduce((total, product) => total + product.estimatedContribution, 0)
  const conversionRate = clicks > 0 ? `${((conversions / clicks) * 100).toFixed(1)}%` : '0%'
  const topProduct = [...products].sort((first, second) => second.estimatedContribution - first.estimatedContribution)[0]

  const metrics = [
    { label: 'Clicks', value: clicks.toLocaleString(), icon: <MousePointerClick className="h-4 w-4" /> },
    { label: 'Conversions', value: conversions.toLocaleString(), icon: <TrendingUp className="h-4 w-4" /> },
    { label: 'Rate', value: conversionRate, icon: <Percent className="h-4 w-4" /> },
    { label: 'Contribution', value: currencyFormatter.format(contribution), icon: <BarChart3 className="h-4 w-4" /> },
  ]

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Performance</h2>
      <p className="mt-1 text-sm text-gray-600">Product tracking signals ready for reports.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span className="text-primary-600">{metric.icon}</span>
              {metric.label}
            </div>
            <p className="mt-2 text-xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>
      {topProduct && (
        <div className="mt-4 rounded-lg border border-gray-100 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Top contributor</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{topProduct.name}</p>
          <p className="mt-1 text-xs text-gray-500">{currencyFormatter.format(topProduct.estimatedContribution)}</p>
        </div>
      )}
    </section>
  )
}
