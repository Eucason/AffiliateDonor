import { Bell, MailOpen, RefreshCw, ShieldAlert } from 'lucide-react'
import { useMemo } from 'react'
import NotificationPreferencesPanel from '@/components/admin/notifications/NotificationPreferencesPanel'
import NotificationsList from '@/components/admin/notifications/NotificationsList'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminFilterPanel from '@/components/admin/shared/AdminFilterPanel'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import AdminTableToolbar from '@/components/admin/shared/AdminTableToolbar'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import {
  defaultAdminNotificationFilters,
  useAdminNotifications,
} from '@/hooks/admin/useAdminNotifications'
import type {
  AdminNotificationFilters,
  AdminNotificationSeverity,
  AdminNotificationStatus,
  AdminNotificationType,
} from '@/types/adminNotification'

export default function AdminNotificationsPage() {
  const {
    filteredNotifications,
    preferences,
    filterOptions,
    filters,
    summary,
    loading,
    saving,
    error,
    refetch,
    updateFilter,
    clearFilters,
    markNotification,
    markAllRead,
  } = useAdminNotifications()

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([key, value]) => value !== defaultAdminNotificationFilters[key as keyof AdminNotificationFilters]),
    [filters],
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="System"
          title="Notifications"
          description="Review admin alerts, filter by severity and source, and mark alerts read or unread."
          actions={
            <>
              <Button type="button" variant="outline" size="sm" onClick={markAllRead} disabled={saving || summary.unreadCount === 0}>
                <MailOpen className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={refetch} disabled={loading || saving}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Notifications" value={summary.totalCount} helperText="Visible alerts" icon={<Bell className="h-5 w-5" />} />
          <AdminStatCard label="Unread" value={summary.unreadCount} helperText="Needs attention" icon={<MailOpen className="h-5 w-5" />} />
          <AdminStatCard label="Critical" value={summary.criticalCount} helperText="High urgency" icon={<ShieldAlert className="h-5 w-5" />} />
          <AdminStatCard label="Archived" value={summary.archivedCount} helperText="Hidden from queue" icon={<Bell className="h-5 w-5" />} />
        </div>

        {error && <AdminErrorState message={error} onRetry={refetch} />}

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <AdminTableToolbar
              title="Admin Alerts"
              description="Search notification title, source, summary, type, or severity."
              searchSlot={
                <AdminSearchInput
                  value={filters.search}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  onClear={() => updateFilter('search', '')}
                  placeholder="Search notifications..."
                />
              }
              actions={<span className="text-sm font-medium text-gray-500">{filteredNotifications.length} visible</span>}
            />
            <NotificationFilters filters={filters} options={filterOptions} onChange={updateFilter} onClear={clearFilters} />
            <NotificationsList
              notifications={filteredNotifications}
              isLoading={loading}
              hasActiveFilters={hasActiveFilters}
              onMarkRead={(notification) => markNotification(notification.id, 'read')}
              onMarkUnread={(notification) => markNotification(notification.id, 'unread')}
            />
          </div>
          <NotificationPreferencesPanel preferences={preferences} />
        </div>
      </div>
    </AdminLayout>
  )
}

function NotificationFilters({
  filters,
  options,
  onChange,
  onClear,
}: {
  filters: AdminNotificationFilters
  options: { types: AdminNotificationType[]; severities: AdminNotificationSeverity[] }
  onChange: <Key extends keyof AdminNotificationFilters>(key: Key, value: AdminNotificationFilters[Key]) => void
  onClear: () => void
}) {
  return (
    <AdminFilterPanel onClear={onClear}>
      <FilterField label="Status">
        <select value={filters.status} onChange={(event) => onChange('status', event.target.value as 'all' | AdminNotificationStatus)} className={inputClasses}>
          <option value="all">All statuses</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
      </FilterField>
      <FilterField label="Type">
        <select value={filters.type} onChange={(event) => onChange('type', event.target.value as 'all' | AdminNotificationType)} className={inputClasses}>
          <option value="all">All types</option>
          {options.types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </FilterField>
      <FilterField label="Severity">
        <select value={filters.severity} onChange={(event) => onChange('severity', event.target.value as 'all' | AdminNotificationSeverity)} className={inputClasses}>
          <option value="all">All severities</option>
          {options.severities.map((severity) => <option key={severity} value={severity}>{severity}</option>)}
        </select>
      </FilterField>
      <FilterField label="Created from">
        <input type="date" value={filters.dateFrom} onChange={(event) => onChange('dateFrom', event.target.value)} className={inputClasses} />
      </FilterField>
      <FilterField label="Created to">
        <input type="date" value={filters.dateTo} onChange={(event) => onChange('dateTo', event.target.value)} className={inputClasses} />
      </FilterField>
      <FilterField label="Sort">
        <select value={filters.sort} onChange={(event) => onChange('sort', event.target.value as AdminNotificationFilters['sort'])} className={inputClasses}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="severity">Severity</option>
          <option value="status">Status</option>
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
