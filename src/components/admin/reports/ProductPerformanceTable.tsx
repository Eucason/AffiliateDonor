import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { formatAdminCurrency, formatAdminDate } from '@/utils/adminFormatters'
import type { AdminProductPerformanceReport } from '@/types/adminReport'

interface ProductPerformanceTableProps {
  products: AdminProductPerformanceReport[]
  isLoading?: boolean
}

export default function ProductPerformanceTable({
  products,
  isLoading = false,
}: ProductPerformanceTableProps) {
  return (
    <AdminDataTable
      rows={products}
      getRowKey={(product) => product.id}
      isLoading={isLoading}
      emptyTitle="No product performance found"
      emptyDescription="Adjust the product, campaign, search, or date filters."
      columns={[
        {
          key: 'product',
          header: 'Product',
          cell: (product) => (
            <div>
              <Link to={product.path} className="font-semibold text-primary-700 hover:text-primary-900">
                {product.name}
              </Link>
              <p className="mt-1 text-xs capitalize text-gray-500">{product.type} product</p>
            </div>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          cell: (product) => <AdminStatusBadge status={product.status} />,
        },
        {
          key: 'cause',
          header: 'Cause',
          cell: (product) => product.linkedCauseName,
        },
        {
          key: 'clicks',
          header: 'Clicks',
          cell: (product) => product.clicks.toLocaleString(),
        },
        {
          key: 'conversions',
          header: 'Conversions',
          cell: (product) => `${product.conversions.toLocaleString()} (${product.conversionRate}%)`,
        },
        {
          key: 'contribution',
          header: 'Contribution',
          cell: (product) => formatAdminCurrency(product.estimatedContribution, 'USD', 0),
        },
        {
          key: 'updated',
          header: 'Updated',
          cell: (product) => formatAdminDate(product.updatedAt),
        },
      ]}
    />
  )
}
