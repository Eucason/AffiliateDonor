import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import AdminConfirmDialog from '@/components/admin/shared/AdminConfirmDialog'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminFilterPanel from '@/components/admin/shared/AdminFilterPanel'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import AdminTableToolbar from '@/components/admin/shared/AdminTableToolbar'
import CauseStatusSummary from '@/components/admin/causes/CauseStatusSummary'
import CausesTable from '@/components/admin/causes/CausesTable'
import AdminLayout from '@/components/organisms/AdminLayout'
import Button from '@/components/atoms/Button'
import { adminCausesAPI } from '@/services/admin/adminCausesAPI'
import { defaultAdminCauseFilters, useAdminCauses } from '@/hooks/admin/useAdminCauses'
import type { AdminCause, AdminCauseFilters, AdminCauseStatus } from '@/types/adminCause'

const statuses: Array<{ value: AdminCauseStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived' },
]

const sorts: Array<{ value: AdminCauseFilters['sort']; label: string }> = [
  { value: 'newest', label: 'Newest updated' },
  { value: 'oldest', label: 'Oldest updated' },
  { value: 'name', label: 'Name' },
  { value: 'raised', label: 'Raised' },
  { value: 'progress', label: 'Progress' },
  { value: 'status', label: 'Status' },
]

export default function AdminCausesPage() {
  const [searchParams] = useSearchParams()
  const initialFilters = useMemo(() => getInitialFilters(searchParams), [searchParams])
  const {
    filteredCauses,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
    replaceCause,
  } = useAdminCauses(initialFilters)
  const [archiveTarget, setArchiveTarget] = useState<AdminCause | null>(null)

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([key, value]) => value !== defaultAdminCauseFilters[key as keyof AdminCauseFilters]),
    [filters],
  )

  const confirmArchive = async () => {
    if (!archiveTarget) {
      return
    }

    const archived = await adminCausesAPI.updateStatus(archiveTarget.id, 'archived')
    replaceCause(archived)
    setArchiveTarget(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Fundraising"
          title="Causes"
          description="Create, publish, feature, archive, and review campaign funding progress."
          actions={
            <>
              <Button type="button" variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Link
                to="/admin/causes/new"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Link>
            </>
          }
        />

        <CauseStatusSummary summary={summary} />

        <AdminTableToolbar
          title="Campaign Records"
          description="Search by campaign name, slug, category, location, description, or status."
          searchSlot={
            <AdminSearchInput
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              onClear={() => updateFilter('search', '')}
              placeholder="Search campaigns..."
            />
          }
          actions={<span className="text-sm font-medium text-gray-500">{filteredCauses.length} visible</span>}
        />

        <AdminFilterPanel onClear={clearFilters}>
          <FilterField label="Status">
            <select
              value={filters.status}
              onChange={(event) => updateFilter('status', event.target.value as AdminCauseFilters['status'])}
              className={inputClasses}
            >
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Category">
            <select
              value={filters.category}
              onChange={(event) => updateFilter('category', event.target.value)}
              className={inputClasses}
            >
              <option value="all">All categories</option>
              {filterOptions.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Featured">
            <select
              value={filters.featured}
              onChange={(event) => updateFilter('featured', event.target.value as AdminCauseFilters['featured'])}
              className={inputClasses}
            >
              <option value="all">Any featured state</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not featured</option>
            </select>
          </FilterField>
          <FilterField label="Verified">
            <select
              value={filters.verified}
              onChange={(event) => updateFilter('verified', event.target.value as AdminCauseFilters['verified'])}
              className={inputClasses}
            >
              <option value="all">Any verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </FilterField>
          <FilterField label="Start from">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) => updateFilter('dateFrom', event.target.value)}
              className={inputClasses}
            />
          </FilterField>
          <FilterField label="Start to">
            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) => updateFilter('dateTo', event.target.value)}
              className={inputClasses}
            />
          </FilterField>
          <FilterField label="Min progress">
            <input
              type="number"
              min="0"
              max="100"
              value={filters.progressMin}
              onChange={(event) => updateFilter('progressMin', event.target.value)}
              placeholder="0"
              className={inputClasses}
            />
          </FilterField>
          <FilterField label="Max progress">
            <input
              type="number"
              min="0"
              max="100"
              value={filters.progressMax}
              onChange={(event) => updateFilter('progressMax', event.target.value)}
              placeholder="100"
              className={inputClasses}
            />
          </FilterField>
          <FilterField label="Sort">
            <select
              value={filters.sort}
              onChange={(event) => updateFilter('sort', event.target.value as AdminCauseFilters['sort'])}
              className={inputClasses}
            >
              {sorts.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </FilterField>
        </AdminFilterPanel>

        {error && !loading && <AdminErrorState message={error} onRetry={refetch} />}

        <CausesTable
          causes={filteredCauses}
          isLoading={loading}
          hasActiveFilters={hasActiveFilters}
          onArchive={setArchiveTarget}
        />

        <AdminConfirmDialog
          open={Boolean(archiveTarget)}
          title="Archive campaign?"
          message={`Archive ${archiveTarget?.name ?? 'this campaign'} so it is retained for reporting but removed from active management queues.`}
          confirmLabel="Archive"
          isDestructive
          onConfirm={confirmArchive}
          onCancel={() => setArchiveTarget(null)}
        />
      </div>
    </AdminLayout>
  )
}

function getInitialFilters(searchParams: URLSearchParams): Partial<AdminCauseFilters> {
  return {
    status: getQueryValue(searchParams, 'status', defaultAdminCauseFilters.status),
    category: getQueryValue(searchParams, 'category', defaultAdminCauseFilters.category),
    featured: getQueryValue(searchParams, 'featured', defaultAdminCauseFilters.featured),
    verified: getQueryValue(searchParams, 'verified', defaultAdminCauseFilters.verified),
  }
}

function getQueryValue<Key extends keyof AdminCauseFilters>(
  searchParams: URLSearchParams,
  key: Key,
  fallback: AdminCauseFilters[Key],
) {
  return (searchParams.get(key) ?? fallback) as AdminCauseFilters[Key]
}

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      {children}
    </label>
  )
}

const inputClasses =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
