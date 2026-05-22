import { Filter, RotateCcw } from 'lucide-react'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import Button from '@/components/atoms/Button'
import type { AdminReportFilterOptions, AdminReportFilters } from '@/types/adminReport'

interface ReportsDateRangeToolbarProps {
  filters: AdminReportFilters
  options: AdminReportFilterOptions
  onChange: <Key extends keyof AdminReportFilters>(key: Key, value: AdminReportFilters[Key]) => void
  onClear: () => void
}

export default function ReportsDateRangeToolbar({
  filters,
  options,
  onChange,
  onClear,
}: ReportsDateRangeToolbarProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-6">
        <label className="space-y-1 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search</span>
          <AdminSearchInput
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
            onClear={() => onChange('search', '')}
            placeholder="Reports, campaigns, products..."
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">From</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onChange('dateFrom', event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">To</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onChange('dateTo', event.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Trend</span>
          <select
            value={filters.granularity}
            onChange={(event) => onChange('granularity', event.target.value as AdminReportFilters['granularity'])}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <div className="flex items-end">
          <Button type="button" variant="ghost" size="sm" onClick={onClear} className="h-10 w-full gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Filter className="hidden h-5 w-5 self-end text-gray-400 xl:block" />
        <SelectFilter
          label="Campaign"
          value={filters.campaign}
          onChange={(value) => onChange('campaign', value)}
          options={options.campaigns}
          allLabel="All campaigns"
        />
        <SelectFilter
          label="Donation Status"
          value={filters.donationStatus}
          onChange={(value) => onChange('donationStatus', value)}
          options={options.donationStatuses}
          allLabel="All statuses"
        />
        <SelectFilter
          label="Payment Method"
          value={filters.paymentMethod}
          onChange={(value) => onChange('paymentMethod', value)}
          options={options.paymentMethods}
          allLabel="All methods"
        />
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Product Type</span>
          <select
            value={filters.productType}
            onChange={(event) => onChange('productType', event.target.value as AdminReportFilters['productType'])}
            className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All products</option>
            {options.productTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'affiliate' ? 'Affiliate' : 'Merch'}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 max-w-sm">
        <SelectFilter
          label="Content Type"
          value={filters.contentType}
          onChange={(value) => onChange('contentType', value)}
          options={options.contentTypes}
          allLabel="All content"
        />
      </div>
    </section>
  )
}

function SelectFilter({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  allLabel: string
  onChange: (value: string) => void
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm capitalize focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      >
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
    </label>
  )
}

function formatOption(value: string) {
  return value.replace(/_/g, ' ')
}
