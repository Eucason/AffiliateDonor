import { Link } from 'react-router-dom'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { formatAdminDate } from '@/utils/adminFormatters'
import type { AdminContentPerformanceReport } from '@/types/adminReport'

interface ContentPerformanceTableProps {
  content: AdminContentPerformanceReport[]
  isLoading?: boolean
}

export default function ContentPerformanceTable({
  content,
  isLoading = false,
}: ContentPerformanceTableProps) {
  return (
    <AdminDataTable
      rows={content}
      getRowKey={(item) => item.id}
      isLoading={isLoading}
      emptyTitle="No content performance found"
      emptyDescription="Adjust the content type, search, or date filters."
      columns={[
        {
          key: 'content',
          header: 'Content',
          cell: (item) => (
            <div>
              <Link to={item.path} className="font-semibold text-primary-700 hover:text-primary-900">
                {item.title}
              </Link>
              <p className="mt-1 text-xs text-gray-500">{formatType(item.type)}</p>
            </div>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          cell: (item) => <AdminStatusBadge status={item.status} />,
        },
        {
          key: 'views',
          header: 'Views',
          cell: (item) => item.views.toLocaleString(),
        },
        {
          key: 'visitors',
          header: 'Visitors',
          cell: (item) => item.uniqueVisitors.toLocaleString(),
        },
        {
          key: 'assists',
          header: 'Conversion Assists',
          cell: (item) => item.conversionAssists.toLocaleString(),
        },
        {
          key: 'updated',
          header: 'Updated',
          cell: (item) => formatAdminDate(item.updatedAt),
        },
      ]}
    />
  )
}

function formatType(value: string) {
  if (value === 'blog_post') {
    return 'Blog Post'
  }

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
