import { Archive, CalendarClock, CheckCircle2, FileText, RefreshCcw, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import ContentAreaList from '@/components/admin/content/ContentAreaList'
import AdminEmptyState from '@/components/admin/shared/AdminEmptyState'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminContent } from '@/hooks/admin/useAdminContent'
import { contentAreaConfigs, contentTypeLabels } from '@/services/admin/adminContentAPI'
import type { AdminContentArea, AdminContentStatus } from '@/types/adminContent'

const areaTitles = new Map(contentAreaConfigs.map((area) => [area.area, area.title]))

export default function AdminContentPage() {
  const {
    blocks,
    filteredBlocks,
    filters,
    summary,
    filterOptions,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
  } = useAdminContent()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Website Content"
          title="Content CMS"
          description="Manage structured homepage, banner, impact story, testimonial, about, and footer content without code changes."
          actions={
            <>
              <Button type="button" variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button type="button" variant="primary" onClick={refetch} disabled={loading} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard label="All Blocks" value={summary.totalCount} icon={<FileText className="h-5 w-5" />} />
          <AdminStatCard label="Published" value={summary.publishedCount} icon={<CheckCircle2 className="h-5 w-5" />} />
          <AdminStatCard label="Drafts" value={summary.draftCount} icon={<FileText className="h-5 w-5" />} />
          <AdminStatCard label="Scheduled" value={summary.scheduledCount} icon={<CalendarClock className="h-5 w-5" />} />
          <AdminStatCard label="Archived" value={summary.archivedCount} icon={<Archive className="h-5 w-5" />} />
        </div>

        {loading ? (
          <AdminLoadingState label="Loading content areas..." />
        ) : error ? (
          <AdminErrorState message={error} onRetry={refetch} />
        ) : (
          <ContentAreaList blocks={blocks} />
        )}

        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-1 xl:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search</span>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  placeholder="Title, area, body, linked entity"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Area</span>
              <select
                value={filters.area}
                onChange={(event) => updateFilter('area', event.target.value as AdminContentArea | 'all')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All areas</option>
                {filterOptions.areas.map((area) => (
                  <option key={area} value={area}>
                    {areaTitles.get(area) ?? area}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
              <select
                value={filters.status}
                onChange={(event) => updateFilter('status', event.target.value as AdminContentStatus | 'all')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Scheduled</span>
              <select
                value={filters.scheduled}
                onChange={(event) => updateFilter('scheduled', event.target.value as typeof filters.scheduled)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="unscheduled">Unscheduled</option>
              </select>
            </label>
          </div>
        </section>

        {loading ? (
          <AdminLoadingState label="Loading content blocks..." />
        ) : filteredBlocks.length === 0 ? (
          <AdminEmptyState
            title="No content blocks match"
            description="Adjust filters or refresh the CMS data."
            icon={<FileText className="h-6 w-6" />}
          />
        ) : (
          <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">Content Blocks</h2>
              <p className="mt-1 text-sm text-gray-600">Filtered view across all public content areas.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Block</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Area</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBlocks.map((block) => (
                    <tr key={block.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <Link to={contentAreaConfigs.find((area) => area.area === block.area)?.path ?? '/admin/content'} className="font-semibold text-primary-700 hover:text-primary-900">
                          {block.title}
                        </Link>
                        <p className="mt-1 max-w-xl text-sm text-gray-600">{block.summary}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{areaTitles.get(block.area) ?? block.area}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{contentTypeLabels[block.type]}</td>
                      <td className="px-4 py-4"><AdminStatusBadge status={block.status} /></td>
                      <td className="px-4 py-4 text-sm text-gray-500">{new Date(block.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </AdminLayout>
  )
}
