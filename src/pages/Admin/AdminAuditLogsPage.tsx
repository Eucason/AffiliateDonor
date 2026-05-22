import { FileWarning, History, RefreshCw, Settings, ShieldAlert } from 'lucide-react'
import { useMemo } from 'react'
import ActivityTimeline from '@/components/admin/audit/ActivityTimeline'
import AuditLogsTable from '@/components/admin/audit/AuditLogsTable'
import AdminDetailDrawer from '@/components/admin/shared/AdminDetailDrawer'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminFilterPanel from '@/components/admin/shared/AdminFilterPanel'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import AdminTableToolbar from '@/components/admin/shared/AdminTableToolbar'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { defaultAdminAuditLogFilters, useAdminAuditLogs } from '@/hooks/admin/useAdminAuditLogs'
import { formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminAuditEntityType, AdminAuditLogFilters } from '@/types/adminAudit'

export default function AdminAuditLogsPage() {
  const {
    filteredLogs,
    filterOptions,
    filters,
    summary,
    selectedLog,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
    setSelectedLog,
  } = useAdminAuditLogs()

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([key, value]) => value !== defaultAdminAuditLogFilters[key as keyof AdminAuditLogFilters]),
    [filters],
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="System"
          title="Audit Logs"
          description="Track admin actions, entity changes, IP/device placeholders, and before/after metadata."
          actions={
            <Button type="button" variant="primary" size="sm" onClick={refetch} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Audit Events" value={summary.totalCount} helperText="Visible log entries" icon={<History className="h-5 w-5" />} />
          <AdminStatCard label="Critical" value={summary.criticalCount} helperText="Needs review" icon={<ShieldAlert className="h-5 w-5" />} />
          <AdminStatCard label="Settings Changes" value={summary.settingsChangeCount} helperText="System configuration" icon={<Settings className="h-5 w-5" />} />
          <AdminStatCard label="Approval Actions" value={summary.approvalActionCount} helperText="Approve or reject events" icon={<FileWarning className="h-5 w-5" />} />
        </div>

        {error && <AdminErrorState message={error} onRetry={refetch} />}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <AdminTableToolbar
              title="Audit Entries"
              description="Search actor, action, entity type, entity label, or entity ID."
              searchSlot={
                <AdminSearchInput
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  onClear={() => updateFilter('search', '')}
                  placeholder="Search audit logs..."
                />
              }
              actions={<span className="text-sm font-medium text-gray-500">{filteredLogs.length} visible</span>}
            />
            <AuditFilters filters={filters} options={filterOptions} onChange={updateFilter} onClear={clearFilters} />
            <AuditLogsTable logs={filteredLogs} isLoading={loading} hasActiveFilters={hasActiveFilters} onView={setSelectedLog} />
          </div>
          <ActivityTimeline logs={filteredLogs} />
        </div>

        <AdminDetailDrawer
          open={Boolean(selectedLog)}
          title={selectedLog ? `${selectedLog.actor} / ${formatAction(selectedLog.action)}` : 'Audit Detail'}
          onClose={() => setSelectedLog(null)}
        >
          {selectedLog && (
            <div className="space-y-5">
              <dl className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm sm:grid-cols-2">
                <Detail label="Actor" value={selectedLog.actor} />
                <Detail label="Action" value={formatAction(selectedLog.action)} />
                <Detail label="Entity" value={selectedLog.entityLabel} />
                <Detail label="Entity ID" value={selectedLog.entityId} />
                <Detail label="Timestamp" value={formatAdminDateTime(selectedLog.timestamp)} />
                <Detail label="IP / Device" value={`${selectedLog.ipAddress} / ${selectedLog.device}`} />
              </dl>
              <PayloadBlock title="Before" payload={selectedLog.before} />
              <PayloadBlock title="After" payload={selectedLog.after} />
              <PayloadBlock title="Metadata" payload={selectedLog.metadata} />
            </div>
          )}
        </AdminDetailDrawer>
      </div>
    </AdminLayout>
  )
}

function AuditFilters({
  filters,
  options,
  onChange,
  onClear,
}: {
  filters: AdminAuditLogFilters
  options: { actors: string[]; actions: string[]; entityTypes: AdminAuditEntityType[] }
  onChange: <Key extends keyof AdminAuditLogFilters>(key: Key, value: AdminAuditLogFilters[Key]) => void
  onClear: () => void
}) {
  return (
    <AdminFilterPanel onClear={onClear}>
      <FilterField label="Actor">
        <select value={filters.actor} onChange={(event) => onChange('actor', event.target.value)} className={inputClasses}>
          <option value="all">All actors</option>
          {options.actors.map((actor) => <option key={actor} value={actor}>{actor}</option>)}
        </select>
      </FilterField>
      <FilterField label="Action">
        <select value={filters.action} onChange={(event) => onChange('action', event.target.value)} className={inputClasses}>
          <option value="all">All actions</option>
          {options.actions.map((action) => <option key={action} value={action}>{formatAction(action)}</option>)}
        </select>
      </FilterField>
      <FilterField label="Entity type">
        <select value={filters.entityType} onChange={(event) => onChange('entityType', event.target.value as 'all' | AdminAuditEntityType)} className={inputClasses}>
          <option value="all">All entities</option>
          {options.entityTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </FilterField>
      <FilterField label="Date from">
        <input type="date" value={filters.dateFrom} onChange={(event) => onChange('dateFrom', event.target.value)} className={inputClasses} />
      </FilterField>
      <FilterField label="Date to">
        <input type="date" value={filters.dateTo} onChange={(event) => onChange('dateTo', event.target.value)} className={inputClasses} />
      </FilterField>
      <FilterField label="Sort">
        <select value={filters.sort} onChange={(event) => onChange('sort', event.target.value as AdminAuditLogFilters['sort'])} className={inputClasses}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="actor">Actor</option>
          <option value="action">Action</option>
          <option value="entity">Entity</option>
        </select>
      </FilterField>
    </AdminFilterPanel>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 font-medium text-gray-900">{value}</dd>
    </div>
  )
}

function PayloadBlock({ title, payload }: { title: string; payload: Record<string, unknown> }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs text-gray-100">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
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

function formatAction(action: string) {
  return action.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const inputClasses =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
