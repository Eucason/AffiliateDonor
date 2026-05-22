import { CheckCircle, Clock, RefreshCw, ShieldAlert, XCircle } from 'lucide-react'
import { useMemo } from 'react'
import ApprovalDetailsDrawer from '@/components/admin/approvals/ApprovalDetailsDrawer'
import ApprovalsQueueTable from '@/components/admin/approvals/ApprovalsQueueTable'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminFilterPanel from '@/components/admin/shared/AdminFilterPanel'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import AdminTableToolbar from '@/components/admin/shared/AdminTableToolbar'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { defaultAdminApprovalFilters, useAdminApprovals } from '@/hooks/admin/useAdminApprovals'
import type {
  AdminApprovalFilters,
  AdminApprovalPriority,
  AdminApprovalRequest,
  AdminApprovalStatus,
  AdminApprovalType,
} from '@/types/adminApproval'

export default function AdminApprovalsPage() {
  const {
    filteredApprovals,
    filterOptions,
    filters,
    summary,
    selectedApproval,
    loading,
    saving,
    error,
    refetch,
    updateFilter,
    clearFilters,
    setSelectedApproval,
    reviewApproval,
  } = useAdminApprovals()

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([key, value]) => value !== defaultAdminApprovalFilters[key as keyof AdminApprovalFilters]),
    [filters],
  )

  const quickReview = (approval: AdminApprovalRequest, status: Extract<AdminApprovalStatus, 'approved' | 'rejected'>) => {
    reviewApproval(approval.id, status, status === 'approved' ? 'Approved from queue.' : 'Rejected from queue.')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Fundraising"
          title="Approvals"
          description="Review campaign, content, product, and refund approval requests before they affect the public site."
          actions={
            <Button type="button" variant="primary" size="sm" onClick={refetch} disabled={loading || saving}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Pending" value={summary.pendingCount} helperText="Awaiting review" icon={<Clock className="h-5 w-5" />} />
          <AdminStatCard label="Approved" value={summary.approvedCount} helperText="Completed approvals" icon={<CheckCircle className="h-5 w-5" />} />
          <AdminStatCard label="Rejected" value={summary.rejectedCount} helperText="Returned requests" icon={<XCircle className="h-5 w-5" />} />
          <AdminStatCard label="Urgent" value={summary.urgentCount} helperText={`${summary.totalCount} total visible`} icon={<ShieldAlert className="h-5 w-5" />} />
        </div>

        {error && <AdminErrorState message={error} onRetry={refetch} />}

        <AdminTableToolbar
          title="Approval Queue"
          description="Search requester, entity, title, summary, type, or status."
          searchSlot={
            <AdminSearchInput
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              onClear={() => updateFilter('search', '')}
              placeholder="Search approvals..."
            />
          }
          actions={<span className="text-sm font-medium text-gray-500">{filteredApprovals.length} visible</span>}
        />
        <ApprovalFilters filters={filters} options={filterOptions} onChange={updateFilter} onClear={clearFilters} />
        <ApprovalsQueueTable
          approvals={filteredApprovals}
          isLoading={loading}
          isSaving={saving}
          hasActiveFilters={hasActiveFilters}
          onView={setSelectedApproval}
          onApprove={(approval) => quickReview(approval, 'approved')}
          onReject={(approval) => quickReview(approval, 'rejected')}
        />
        <ApprovalDetailsDrawer
          approval={selectedApproval}
          open={Boolean(selectedApproval)}
          isSaving={saving}
          onClose={() => setSelectedApproval(null)}
          onReview={reviewApproval}
        />
      </div>
    </AdminLayout>
  )
}

function ApprovalFilters({
  filters,
  options,
  onChange,
  onClear,
}: {
  filters: AdminApprovalFilters
  options: {
    types: AdminApprovalType[]
    statuses: AdminApprovalStatus[]
    priorities: AdminApprovalPriority[]
    requesters: string[]
  }
  onChange: <Key extends keyof AdminApprovalFilters>(key: Key, value: AdminApprovalFilters[Key]) => void
  onClear: () => void
}) {
  return (
    <AdminFilterPanel onClear={onClear}>
      <FilterField label="Status">
        <select value={filters.status} onChange={(event) => onChange('status', event.target.value as 'all' | AdminApprovalStatus)} className={inputClasses}>
          <option value="all">All statuses</option>
          {options.statuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </FilterField>
      <FilterField label="Type">
        <select value={filters.type} onChange={(event) => onChange('type', event.target.value as 'all' | AdminApprovalType)} className={inputClasses}>
          <option value="all">All types</option>
          {options.types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </FilterField>
      <FilterField label="Priority">
        <select value={filters.priority} onChange={(event) => onChange('priority', event.target.value as 'all' | AdminApprovalPriority)} className={inputClasses}>
          <option value="all">All priorities</option>
          {options.priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
        </select>
      </FilterField>
      <FilterField label="Submitted from">
        <input type="date" value={filters.dateFrom} onChange={(event) => onChange('dateFrom', event.target.value)} className={inputClasses} />
      </FilterField>
      <FilterField label="Submitted to">
        <input type="date" value={filters.dateTo} onChange={(event) => onChange('dateTo', event.target.value)} className={inputClasses} />
      </FilterField>
      <FilterField label="Sort">
        <select value={filters.sort} onChange={(event) => onChange('sort', event.target.value as AdminApprovalFilters['sort'])} className={inputClasses}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
          <option value="requester">Requester</option>
        </select>
      </FilterField>
    </AdminFilterPanel>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      {children}
    </label>
  )
}

const inputClasses =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
