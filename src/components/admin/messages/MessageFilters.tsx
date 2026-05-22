import type { ReactNode } from 'react'
import AdminFilterPanel from '@/components/admin/shared/AdminFilterPanel'
import type {
  AdminMessageFilterOptions,
  AdminMessageFilters,
  AdminMessageSeverity,
  AdminMessageStatus,
} from '@/types/adminMessage'

interface MessageFiltersProps {
  filters: AdminMessageFilters
  options: AdminMessageFilterOptions
  onChange: <Key extends keyof AdminMessageFilters>(key: Key, value: AdminMessageFilters[Key]) => void
  onClear: () => void
}

const statuses: Array<{ value: AdminMessageStatus; label: string }> = [
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'pending', label: 'Pending' },
  { value: 'replied', label: 'Replied' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'archived', label: 'Archived' },
  { value: 'spam', label: 'Spam' },
]

const severities: Array<{ value: AdminMessageSeverity; label: string }> = [
  { value: 'normal', label: 'Normal' },
  { value: 'priority', label: 'Priority' },
  { value: 'urgent', label: 'Urgent' },
]

const sorts: Array<{ value: AdminMessageFilters['sort']; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'status', label: 'Status' },
  { value: 'sender', label: 'Sender' },
  { value: 'assigned', label: 'Assigned admin' },
]

export default function MessageFilters({ filters, options, onChange, onClear }: MessageFiltersProps) {
  return (
    <AdminFilterPanel onClear={onClear}>
      <FilterField label="Status">
        <select
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value as 'all' | AdminMessageStatus)}
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
      <FilterField label="Assigned admin">
        <select
          value={filters.assignedAdmin}
          onChange={(event) => onChange('assignedAdmin', event.target.value)}
          className={inputClasses}
        >
          <option value="all">All assignees</option>
          {options.assignedAdmins.map((admin) => (
            <option key={admin} value={admin}>
              {admin}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Donor match">
        <select
          value={filters.donorMatch}
          onChange={(event) => onChange('donorMatch', event.target.value as AdminMessageFilters['donorMatch'])}
          className={inputClasses}
        >
          <option value="all">Any match state</option>
          <option value="matched">Has donor match</option>
          <option value="unmatched">No donor match</option>
        </select>
      </FilterField>
      <FilterField label="Severity">
        <select
          value={filters.severity}
          onChange={(event) => onChange('severity', event.target.value as 'all' | AdminMessageSeverity)}
          className={inputClasses}
        >
          <option value="all">Any severity</option>
          {severities.map((severity) => (
            <option key={severity.value} value={severity.value}>
              {severity.label}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Received from">
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onChange('dateFrom', event.target.value)}
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Received to">
        <input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onChange('dateTo', event.target.value)}
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Sort">
        <select
          value={filters.sort}
          onChange={(event) => onChange('sort', event.target.value as AdminMessageFilters['sort'])}
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
  )
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
