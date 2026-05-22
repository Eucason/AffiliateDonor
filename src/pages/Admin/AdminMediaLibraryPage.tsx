import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Copy,
  FileImage,
  Image,
  RefreshCcw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react'
import MediaLibraryGrid from '@/components/admin/content/MediaLibraryGrid'
import AdminDetailDrawer from '@/components/admin/shared/AdminDetailDrawer'
import AdminEmptyState from '@/components/admin/shared/AdminEmptyState'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminMedia } from '@/hooks/admin/useAdminMedia'
import { adminMediaAPI } from '@/services/admin/adminMediaAPI'
import type {
  AdminMediaAsset,
  AdminMediaType,
  AdminMediaUploadRequest,
  AdminMediaUsageArea,
} from '@/types/adminMedia'

const emptyUpload: AdminMediaUploadRequest = {
  title: '',
  fileName: '',
  url: '',
  mimeType: 'image/jpeg',
  type: 'image',
  sizeBytes: 500000,
  width: undefined,
  height: undefined,
  altText: '',
  caption: '',
  tags: [],
  uploadedBy: 'Admin Team',
}

export default function AdminMediaLibraryPage() {
  const {
    filteredAssets,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
    replaceAsset,
    addAsset,
    removeAsset,
  } = useAdminMedia()
  const [selectedAsset, setSelectedAsset] = useState<AdminMediaAsset | null>(null)
  const [draftAsset, setDraftAsset] = useState<AdminMediaAsset | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadDraft, setUploadDraft] = useState<AdminMediaUploadRequest>(emptyUpload)
  const [tagInput, setTagInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    setDraftAsset(selectedAsset)
  }, [selectedAsset])

  const usageAreaLabels = useMemo(
    () =>
      new Map<AdminMediaUsageArea, string>([
        ['blog', 'Blog'],
        ['content', 'Website Content'],
        ['causes', 'Causes'],
        ['products', 'Products'],
        ['settings', 'Settings'],
        ['unused', 'Unused'],
      ]),
    [],
  )

  const handleSaveAsset = async () => {
    if (!draftAsset) {
      return
    }

    try {
      setBusy(true)
      setActionError(null)
      const updated = await adminMediaAPI.updateAsset(draftAsset.id, draftAsset)
      replaceAsset(updated)
      setSelectedAsset(updated)
    } catch (requestError) {
      console.error('Failed to save media metadata:', requestError)
      setActionError('Media metadata could not be saved.')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteAsset = async () => {
    if (!selectedAsset) {
      return
    }

    const confirmed = window.confirm('Delete this media asset from the admin library?')
    if (!confirmed) {
      return
    }

    try {
      setBusy(true)
      setActionError(null)
      await adminMediaAPI.deleteAsset(selectedAsset.id)
      removeAsset(selectedAsset.id)
      setSelectedAsset(null)
    } catch (requestError) {
      console.error('Failed to delete media asset:', requestError)
      setActionError('Media asset could not be deleted.')
    } finally {
      setBusy(false)
    }
  }

  const handleUpload = async () => {
    if (!uploadDraft.title.trim() || !uploadDraft.fileName.trim() || !uploadDraft.url.trim()) {
      setActionError('Title, file name, and URL are required for media uploads.')
      return
    }

    try {
      setBusy(true)
      setActionError(null)
      const created = await adminMediaAPI.uploadAsset(uploadDraft)
      addAsset(created)
      setSelectedAsset(created)
      setUploadDraft(emptyUpload)
      setTagInput('')
      setUploadOpen(false)
    } catch (requestError) {
      console.error('Failed to add media asset:', requestError)
      setActionError('Media asset could not be added.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Content"
          title="Media Library"
          description="Manage reusable images and assets used by blog posts, content blocks, campaigns, products, and settings."
          actions={
            <>
              <Button type="button" variant="outline" onClick={refetch} disabled={loading || busy} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Button type="button" variant="primary" onClick={() => setUploadOpen(true)} disabled={busy} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard label="Assets" value={summary.totalCount} icon={<FileImage className="h-5 w-5" />} />
          <AdminStatCard label="Images" value={summary.imageCount} icon={<Image className="h-5 w-5" />} />
          <AdminStatCard label="Used" value={summary.usedCount} helperText={`${summary.unusedCount} unused`} />
          <AdminStatCard label="Missing Alt" value={summary.missingAltCount} icon={<AlertTriangle className="h-5 w-5" />} />
          <AdminStatCard label="Storage" value={formatBytes(summary.storageBytes)} helperText="Fallback estimate" />
        </div>

        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <label className="space-y-1 xl:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search</span>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  placeholder="File name, title, alt text, caption, URL, tags"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Type</span>
              <select
                value={filters.type}
                onChange={(event) => updateFilter('type', event.target.value as AdminMediaType | 'all')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All types</option>
                {filterOptions.types.map((type) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Usage</span>
              <select
                value={filters.usageArea}
                onChange={(event) => updateFilter('usageArea', event.target.value as AdminMediaUsageArea | 'all')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All usage</option>
                {filterOptions.usageAreas.map((area) => (
                  <option key={area} value={area}>
                    {usageAreaLabels.get(area) ?? area}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Uploaded By</span>
              <select
                value={filters.uploadedBy}
                onChange={(event) => updateFilter('uploadedBy', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="">Anyone</option>
                {filterOptions.uploadedBy.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Alt Text</span>
              <select
                value={filters.missingAlt}
                onChange={(event) => updateFilter('missingAlt', event.target.value as typeof filters.missingAlt)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All</option>
                <option value="missing">Missing alt</option>
                <option value="complete">Complete</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(event) => updateFilter('dateFrom', event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                aria-label="Uploaded from"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(event) => updateFilter('dateTo', event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                aria-label="Uploaded to"
              />
              <select
                value={filters.sort}
                onChange={(event) => updateFilter('sort', event.target.value as typeof filters.sort)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                aria-label="Sort media"
              >
                <option value="newest">Recently updated</option>
                <option value="oldest">Oldest uploaded</option>
                <option value="title">Title</option>
                <option value="size_desc">Largest size</option>
                <option value="usage_desc">Most used</option>
              </select>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </section>

        {(error || actionError) && <AdminErrorState message={error ?? actionError ?? ''} onRetry={refetch} />}

        {loading ? (
          <AdminLoadingState label="Loading media assets..." />
        ) : filteredAssets.length === 0 ? (
          <AdminEmptyState
            title="No media assets found"
            description="Upload an asset or adjust the current filters."
            actionLabel="Upload Asset"
            onAction={() => setUploadOpen(true)}
            icon={<FileImage className="h-6 w-6" />}
          />
        ) : (
          <MediaLibraryGrid assets={filteredAssets} selectedId={selectedAsset?.id} onSelect={setSelectedAsset} onDetails={setSelectedAsset} />
        )}

        <AdminDetailDrawer
          open={Boolean(selectedAsset && draftAsset)}
          title={selectedAsset?.title ?? 'Media details'}
          onClose={() => setSelectedAsset(null)}
        >
          {draftAsset && (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {draftAsset.type === 'image' || draftAsset.type === 'svg' ? (
                  <img src={draftAsset.url} alt="" className="max-h-80 w-full object-contain" />
                ) : (
                  <div className="flex h-48 items-center justify-center text-gray-500">
                    <FileImage className="h-12 w-12" />
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                {renderAssetInput('Title', draftAsset.title, (value) => setDraftAsset({ ...draftAsset, title: value }))}
                {renderAssetInput('Alt Text', draftAsset.altText, (value) => setDraftAsset({ ...draftAsset, altText: value }))}
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Caption</span>
                  <textarea
                    rows={3}
                    value={draftAsset.caption}
                    onChange={(event) => setDraftAsset({ ...draftAsset, caption: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </label>
                {renderAssetInput('Tags', draftAsset.tags.join(', '), (value) =>
                  setDraftAsset({
                    ...draftAsset,
                    tags: value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }),
                )}
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Asset URL</p>
                <div className="mt-2 flex gap-2">
                  <input
                    readOnly
                    value={draftAsset.url}
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(draftAsset.url)} className="gap-2">
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Used In</p>
                {draftAsset.usage.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">This asset is not currently linked to a managed entity.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {draftAsset.usage.map((usage) => (
                      <a key={usage.id} href={usage.path} className="block rounded-lg bg-gray-50 p-3 text-sm hover:bg-primary-50">
                        <span className="font-semibold text-gray-900">{usage.label}</span>
                        <span className="ml-2 text-gray-500">{usage.area}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-4">
                <Button type="button" variant="outline" onClick={handleDeleteAsset} disabled={busy} className="gap-2 border-red-600 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedAsset(null)} disabled={busy}>
                    Close
                  </Button>
                  <Button type="button" variant="primary" onClick={handleSaveAsset} disabled={busy}>
                    Save Metadata
                  </Button>
                </div>
              </div>
            </div>
          )}
        </AdminDetailDrawer>

        <AdminDetailDrawer open={uploadOpen} title="Upload Media Asset" onClose={() => setUploadOpen(false)}>
          <div className="space-y-4">
            {renderUploadInput('Title', uploadDraft.title, (value) => setUploadDraft({ ...uploadDraft, title: value }))}
            {renderUploadInput('File Name', uploadDraft.fileName, (value) => setUploadDraft({ ...uploadDraft, fileName: value }))}
            {renderUploadInput('Asset URL', uploadDraft.url, (value) => setUploadDraft({ ...uploadDraft, url: value }))}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Type</span>
                <select
                  value={uploadDraft.type}
                  onChange={(event) => setUploadDraft({ ...uploadDraft, type: event.target.value as AdminMediaType })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="image">Image</option>
                  <option value="svg">SVG</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="other">Other</option>
                </select>
              </label>
              {renderUploadInput('MIME Type', uploadDraft.mimeType, (value) => setUploadDraft({ ...uploadDraft, mimeType: value }))}
              {renderUploadInput('Size Bytes', String(uploadDraft.sizeBytes), (value) => setUploadDraft({ ...uploadDraft, sizeBytes: Number(value) || 0 }), 'number')}
              {renderUploadInput('Uploaded By', uploadDraft.uploadedBy, (value) => setUploadDraft({ ...uploadDraft, uploadedBy: value }))}
            </div>
            {renderUploadInput('Alt Text', uploadDraft.altText, (value) => setUploadDraft({ ...uploadDraft, altText: value }))}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Caption</span>
              <textarea
                rows={3}
                value={uploadDraft.caption}
                onChange={(event) => setUploadDraft({ ...uploadDraft, caption: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Tags</span>
              <input
                value={tagInput}
                onChange={(event) => {
                  setTagInput(event.target.value)
                  setUploadDraft({
                    ...uploadDraft,
                    tags: event.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }}
                placeholder="campaign, hero, product"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>
            <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)} disabled={busy}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={handleUpload} disabled={busy}>
                Add Asset
              </Button>
            </div>
          </div>
        </AdminDetailDrawer>
      </div>
    </AdminLayout>
  )
}

function renderAssetInput(label: string, value: string, onChange: (value: string) => void) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      />
    </label>
  )
}

function renderUploadInput(label: string, value: string, onChange: (value: string) => void, type = 'text') {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      />
    </label>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}
