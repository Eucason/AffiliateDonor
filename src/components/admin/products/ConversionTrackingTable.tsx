import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import type { AdminDataTableColumn } from '@/components/admin/shared/AdminDataTable'
import type { AdminProductConversion } from '@/types/adminProduct'

interface ConversionTrackingTableProps {
  conversions: AdminProductConversion[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function ConversionTrackingTable({ conversions }: ConversionTrackingTableProps) {
  const columns: AdminDataTableColumn<AdminProductConversion>[] = [
    {
      key: 'label',
      header: 'Window',
      cell: (conversion) => (
        <div>
          <p className="font-semibold text-gray-900">{conversion.label}</p>
          <p className="text-xs text-gray-500">{conversion.source.replace(/_/g, ' ')}</p>
        </div>
      ),
    },
    { key: 'clicks', header: 'Clicks', cell: (conversion) => conversion.clicks.toLocaleString() },
    { key: 'conversions', header: 'Conversions', cell: (conversion) => conversion.conversions.toLocaleString() },
    {
      key: 'contribution',
      header: 'Contribution',
      cell: (conversion) => currencyFormatter.format(conversion.estimatedContribution),
    },
    {
      key: 'date',
      header: 'Updated',
      cell: (conversion) => new Date(conversion.occurredAt).toLocaleDateString(),
    },
  ]

  return (
    <AdminDataTable
      columns={columns}
      rows={conversions}
      getRowKey={(conversion) => conversion.id}
      emptyTitle="No tracking data"
      emptyDescription="Clicks and conversions will appear once tracking events are available."
    />
  )
}
