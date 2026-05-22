import { ArrowRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import { contentAreaConfigs } from '@/services/admin/adminContentAPI'
import type { AdminContentBlock } from '@/types/adminContent'

interface ContentAreaListProps {
  blocks: AdminContentBlock[]
}

export default function ContentAreaList({ blocks }: ContentAreaListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {contentAreaConfigs.map((area) => {
        const areaBlocks = blocks.filter((block) => block.area === area.area)
        const published = areaBlocks.filter((block) => block.status === 'published').length
        const drafts = areaBlocks.filter((block) => block.status === 'draft').length

        return (
          <Link
            key={area.area}
            to={area.path}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-lg bg-primary-50 p-3 text-primary-600">
                <FileText className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-gray-900">{area.title}</h2>
            <p className="mt-1 min-h-10 text-sm text-gray-600">{area.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <AdminStatusBadge status="published" label={`${published} published`} />
              <AdminStatusBadge status="draft" label={`${drafts} draft`} />
              <AdminStatusBadge status="active" label={`${areaBlocks.length} total`} tone="blue" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
