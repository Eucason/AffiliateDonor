import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '@/components/organisms/AdminLayout'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import AdminTableToolbar from '@/components/admin/shared/AdminTableToolbar'
import DonationDetailsDrawer from '@/components/admin/donations/DonationDetailsDrawer'
import DonationExportControls from '@/components/admin/donations/DonationExportControls'
import DonationFilters from '@/components/admin/donations/DonationFilters'
import DonationStatusSummary from '@/components/admin/donations/DonationStatusSummary'
import DonationsTable from '@/components/admin/donations/DonationsTable'
import Button from '@/components/atoms/Button'
import {
  defaultAdminDonationFilters,
  useAdminDonations,
} from '@/hooks/admin/useAdminDonations'
import { adminDonationsAPI } from '@/services/admin/adminDonationsAPI'
import type { AdminDonation, AdminDonationFilters } from '@/types/adminDonation'

export default function AdminDonationsPage() {
  const [searchParams] = useSearchParams()
  const initialFilters = useMemo(() => getInitialFilters(searchParams), [searchParams])
  const {
    filteredDonations,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
  } = useAdminDonations(initialFilters)
  const [selectedDonation, setSelectedDonation] = useState<AdminDonation | null>(null)

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([key, value]) => value !== defaultAdminDonationFilters[key as keyof AdminDonationFilters]),
    [filters],
  )

  const handleMarkReviewed = async (donation: AdminDonation) => {
    const reviewed = await adminDonationsAPI.markReviewed(donation.id)
    setSelectedDonation(reviewed)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Money Movement"
          title="Donations"
          description="Review contributions, transaction IDs, payment statuses, campaign links, and CSV exports."
          actions={
            <>
              <DonationExportControls donations={filteredDonations} />
              <Button type="button" variant="primary" size="sm" onClick={refetch}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </>
          }
        />

        <DonationStatusSummary summary={summary} />

        <AdminTableToolbar
          title="Contribution Records"
          description="Search by donor, email, campaign, transaction ID, donation ID, method, or status."
          searchSlot={
            <AdminSearchInput
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              onClear={() => updateFilter('search', '')}
              placeholder="Search donations..."
            />
          }
          actions={<span className="text-sm font-medium text-gray-500">{filteredDonations.length} visible</span>}
        />

        <DonationFilters
          filters={filters}
          options={filterOptions}
          onChange={updateFilter}
          onClear={clearFilters}
        />

        {error && !loading && <AdminErrorState message={error} onRetry={refetch} />}

        <DonationsTable
          donations={filteredDonations}
          isLoading={loading}
          hasActiveFilters={hasActiveFilters}
          onView={setSelectedDonation}
        />

        <DonationDetailsDrawer
          donation={selectedDonation}
          open={Boolean(selectedDonation)}
          onClose={() => setSelectedDonation(null)}
          onMarkReviewed={handleMarkReviewed}
        />
      </div>
    </AdminLayout>
  )
}

function getInitialFilters(searchParams: URLSearchParams): Partial<AdminDonationFilters> {
  return {
    status: getQueryValue(searchParams, 'status', defaultAdminDonationFilters.status),
    campaign: getQueryValue(searchParams, 'campaign', defaultAdminDonationFilters.campaign),
    method: getQueryValue(searchParams, 'method', defaultAdminDonationFilters.method),
  }
}

function getQueryValue<Key extends keyof AdminDonationFilters>(
  searchParams: URLSearchParams,
  key: Key,
  fallback: AdminDonationFilters[Key],
) {
  return (searchParams.get(key) ?? fallback) as AdminDonationFilters[Key]
}
