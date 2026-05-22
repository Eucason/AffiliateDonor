import { useEffect, useMemo, useState } from 'react'
import { Archive, CalendarClock, CheckCircle2, FileText, RefreshCcw, Search } from 'lucide-react'
import ContentBlockEditor from '@/components/admin/content/ContentBlockEditor'
import AdminEmptyState from '@/components/admin/shared/AdminEmptyState'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import AdminStatusBadge from '@/components/admin/shared/AdminStatusBadge'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminContent } from '@/hooks/admin/useAdminContent'
import { adminContentAPI, contentTypeLabels, getContentAreaConfig } from '@/services/admin/adminContentAPI'
import type { AdminContentArea, AdminContentBlock, AdminContentStatus } from '@/types/adminContent'

interface AdminContentAreaPageProps {
  area: AdminContentArea
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function AdminContentAreaPage({ area }: AdminContentAreaPageProps) {
  const areaConfig = getContentAreaConfig(area)
  const {
    filteredBlocks,
    filters,
    summary,
    loading,
    error,
    refetch,
    updateFilter,
    replaceBlock,
  } = useAdminContent(area)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedId && filteredBlocks.length > 0) {
      setSelectedId(filteredBlocks[0].id)
      return
    }

    if (selectedId && !filteredBlocks.some((block) => block.id === selectedId)) {
      setSelectedId(filteredBlocks[0]?.id ?? null)
    }
  }, [filteredBlocks, selectedId])

  const selectedBlock = useMemo(
    () => filteredBlocks.find((block) => block.id === selectedId) ?? filteredBlocks[0],
    [filteredBlocks, selectedId],
  )

  const saveBlock = async (block: AdminContentBlock) => {
    try {
      setSaving(true)
      setActionError(null)
      replaceBlock(await adminContentAPI.updateContentBlock(block.id, block))
    } catch (requestError) {
      console.error('Failed to save content block:', requestError)
      setActionError('Content block could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (id: string, status: AdminContentStatus) => {
    try {
      setSaving(true)
      setActionError(null)
      replaceBlock(await adminContentAPI.updateContentStatus(id, status))
    } catch (requestError) {
      console.error('Failed to update content status:', requestError)
      setActionError('Content status could not be updated.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Website Content"
          title={areaConfig.title}
          description={areaConfig.description}
          actions={
            <Button type="button" variant="outline" onClick={refetch} disabled={loading || saving} className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Published" value={summary.publishedCount} icon={<CheckCircle2 className="h-5 w-5" />} />
          <AdminStatCard label="Drafts" value={summary.draftCount} icon={<FileText className="h-5 w-5" />} />
          <AdminStatCard label="Scheduled" value={summary.scheduledCount} icon={<CalendarClock className="h-5 w-5" />} />
          <AdminStatCard label="Archived" value={summary.archivedCount} icon={<Archive className="h-5 w-5" />} />
        </div>

        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-1 xl:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search</span>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  placeholder="Title, body, linked entity"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
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
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Type</span>
              <select
                value={filters.type}
                onChange={(event) => updateFilter('type', event.target.value as typeof filters.type)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All types</option>
                {areaConfig.allowedTypes.map((type) => (
                  <option key={type} value={type}>
                    {contentTypeLabels[type]}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sort</span>
              <select
                value={filters.sort}
                onChange={(event) => updateFilter('sort', event.target.value as typeof filters.sort)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="order">Section order</option>
                <option value="newest">Recently updated</option>
                <option value="oldest">Oldest updated</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </label>
          </div>
        </section>

        {(error || actionError) && <AdminErrorState message={error ?? actionError ?? ''} onRetry={refetch} />}

        {loading ? (
          <AdminLoadingState label={`Loading ${areaConfig.title.toLowerCase()} content...`} />
        ) : filteredBlocks.length === 0 ? (
          <AdminEmptyState
            title="No content blocks found"
            description="Try clearing filters or refreshing this content area."
            icon={<FileText className="h-6 w-6" />}
          />
        ) : (
          <div className="grid gap-6 2xl:grid-cols-[24rem_minmax(0,1fr)]">
            <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">Blocks</h2>
                <p className="mt-1 text-sm text-gray-600">Select a block to edit and preview.</p>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredBlocks.map((block) => (
                  <button
                    key={block.id}
                    type="button"
                    onClick={() => setSelectedId(block.id)}
                    className={`w-full px-5 py-4 text-left transition hover:bg-gray-50 ${
                      selectedBlock?.id === block.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{block.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{contentTypeLabels[block.type]}</p>
                      </div>
                      <AdminStatusBadge status={block.status} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">{block.summary}</p>
                    <p className="mt-2 text-xs text-gray-400">Updated {dateFormatter.format(new Date(block.updatedAt))}</p>
                  </button>
                ))}
              </div>
            </section>

            {selectedBlock && (
              <ContentBlockEditor
                key={selectedBlock.id}
                block={selectedBlock}
                saving={saving}
                onSave={saveBlock}
                onStatusChange={updateStatus}
              />
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
