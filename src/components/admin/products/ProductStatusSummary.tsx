import { Archive, Boxes, MousePointerClick, PackageCheck, Star } from 'lucide-react'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import type { AdminProductSummary } from '@/types/adminProduct'

interface ProductStatusSummaryProps {
  summary: AdminProductSummary
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function ProductStatusSummary({ summary }: ProductStatusSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <AdminStatCard label="Products" value={summary.totalCount} icon={<Boxes className="h-5 w-5" />} />
      <AdminStatCard label="Published" value={summary.publishedCount} icon={<PackageCheck className="h-5 w-5" />} />
      <AdminStatCard label="Featured" value={summary.featuredCount} icon={<Star className="h-5 w-5" />} />
      <AdminStatCard label="Low Stock" value={summary.lowStockCount} icon={<Archive className="h-5 w-5" />} />
      <AdminStatCard
        label="Contribution"
        value={currencyFormatter.format(summary.estimatedContribution)}
        icon={<MousePointerClick className="h-5 w-5" />}
        helperText={`${summary.conversionCount.toLocaleString()} conversions`}
      />
    </div>
  )
}
