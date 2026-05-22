import type { ReactNode } from 'react'
import AdminFilterPanel from '@/components/admin/shared/AdminFilterPanel'
import type {
  AdminDonationFilterOptions,
  AdminDonationFilters,
  AdminDonationMethod,
  AdminDonationStatus,
} from '@/types/adminDonation'

interface DonationFiltersProps {
  filters: AdminDonationFilters
  options: AdminDonationFilterOptions
  onChange: <Key extends keyof AdminDonationFilters>(key: Key, value: AdminDonationFilters[Key]) => void
  onClear: () => void
}

const statuses: Array<{ value: AdminDonationStatus; label: string }> = [
  { value: 'successful', label: 'Successful' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

const sorts: Array<{ value: AdminDonationFilters['sort']; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest', label: 'Highest amount' },
  { value: 'lowest', label: 'Lowest amount' },
  { value: 'status', label: 'Status' },
  { value: 'campaign', label: 'Campaign' },
]

export default function DonationFilters({ filters, options, onChange, onClear }: DonationFiltersProps) {
  const campaignOptions =
    filters.campaign !== 'all' && !options.campaigns.includes(filters.campaign)
      ? [filters.campaign, ...options.campaigns]
      : options.campaigns
  const methodOptions =
    filters.method !== 'all' && !options.methods.includes(filters.method)
      ? [filters.method, ...options.methods]
      : options.methods

  return (
    <AdminFilterPanel onClear={onClear}>
      <FilterField label="Date from">
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onChange('dateFrom', event.target.value)}
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Date to">
        <input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onChange('dateTo', event.target.value)}
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Status">
        <select
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value as AdminDonationFilters['status'])}
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
      <FilterField label="Campaign">
        <select
          value={filters.campaign}
          onChange={(event) => onChange('campaign', event.target.value)}
          className={inputClasses}
        >
          <option value="all">All campaigns</option>
          {campaignOptions.map((campaign) => (
            <option key={campaign} value={campaign}>
              {campaign}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Payment method">
        <select
          value={filters.method}
          onChange={(event) => onChange('method', event.target.value as 'all' | AdminDonationMethod)}
          className={inputClasses}
        >
          <option value="all">All methods</option>
          {methodOptions.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Currency">
        <select
          value={filters.currency}
          onChange={(event) => onChange('currency', event.target.value)}
          className={inputClasses}
        >
          <option value="all">All currencies</option>
          {options.currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Min amount">
        <input
          type="number"
          min="0"
          value={filters.amountMin}
          onChange={(event) => onChange('amountMin', event.target.value)}
          placeholder="0"
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Max amount">
        <input
          type="number"
          min="0"
          value={filters.amountMax}
          onChange={(event) => onChange('amountMax', event.target.value)}
          placeholder="Any"
          className={inputClasses}
        />
      </FilterField>
      <FilterField label="Sort">
        <select
          value={filters.sort}
          onChange={(event) => onChange('sort', event.target.value as AdminDonationFilters['sort'])}
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
