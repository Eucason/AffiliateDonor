import type { ReactNode } from 'react'
import AdminFilterPanel from '@/components/admin/shared/AdminFilterPanel'
import type { AdminUserFilterOptions, AdminUserFilters, AdminUserRole, AdminUserStatus } from '@/types/adminUser'

interface UserFiltersProps {
  filters: AdminUserFilters
  options: AdminUserFilterOptions
  onChange: <Key extends keyof AdminUserFilters>(key: Key, value: AdminUserFilters[Key]) => void
  onClear: () => void
}

const roles: Array<{ value: AdminUserRole; label: string }> = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'support', label: 'Support' },
  { value: 'donor', label: 'Donor' },
]

const sorts: Array<{ value: AdminUserFilters['sort']; label: string }> = [
  { value: 'newest', label: 'Newest signup' },
  { value: 'oldest', label: 'Oldest signup' },
  { value: 'name', label: 'Name' },
  { value: 'total-donations', label: 'Total donations' },
  { value: 'impact', label: 'Impact score' },
  { value: 'last-active', label: 'Last active' },
  { value: 'role', label: 'Role' },
]

export default function UserFilters({ filters, options, onChange, onClear }: UserFiltersProps) {
  const roleOptions =
    filters.role !== 'all' && !options.roles.includes(filters.role)
      ? [filters.role, ...options.roles]
      : options.roles

  return (
    <AdminFilterPanel onClear={onClear}>
      <FilterField label="Role">
        <select
          value={filters.role}
          onChange={(event) => onChange('role', event.target.value as 'all' | AdminUserRole)}
          className={inputClasses}
        >
          <option value="all">All roles</option>
          {mergeRoles(roleOptions).map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Donor state">
        <select
          value={filters.donorState}
          onChange={(event) => onChange('donorState', event.target.value as AdminUserFilters['donorState'])}
          className={inputClasses}
        >
          <option value="all">All users</option>
          <option value="donors">Donors only</option>
          <option value="non-donors">Non-donors</option>
        </select>
      </FilterField>
      <FilterField label="Activity">
        <select
          value={filters.activityStatus}
          onChange={(event) => onChange('activityStatus', event.target.value as 'all' | AdminUserStatus)}
          className={inputClasses}
        >
          <option value="all">Any activity</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </FilterField>
      <FilterField label="Cause supported">
        <select
          value={filters.cause}
          onChange={(event) => onChange('cause', event.target.value)}
          className={inputClasses}
        >
          <option value="all">All causes</option>
          {options.causes.map((cause) => (
            <option key={cause} value={cause}>
              {cause}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Signup from">
        <input
          type="date"
          value={filters.signupFrom}
          onChange={(event) => onChange('signupFrom', event.target.value)}
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Signup to">
        <input
          type="date"
          value={filters.signupTo}
          onChange={(event) => onChange('signupTo', event.target.value)}
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Donation min">
        <input
          type="number"
          min="0"
          value={filters.donationMin}
          onChange={(event) => onChange('donationMin', event.target.value)}
          placeholder="0"
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Donation max">
        <input
          type="number"
          min="0"
          value={filters.donationMax}
          onChange={(event) => onChange('donationMax', event.target.value)}
          placeholder="Any"
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Sort">
        <select
          value={filters.sort}
          onChange={(event) => onChange('sort', event.target.value as AdminUserFilters['sort'])}
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

function mergeRoles(values: AdminUserRole[]) {
  const roleMap = new Map(roles.map((role) => [role.value, role]))
  values.forEach((value) => {
    if (!roleMap.has(value)) {
      roleMap.set(value, { value, label: value })
    }
  })
  return Array.from(roleMap.values())
}

const inputClasses =
  'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
