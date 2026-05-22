import { RefreshCcw } from 'lucide-react'
import DonationTrendsChart from '@/components/admin/reports/DonationTrendsChart'
import ReportExportControls from '@/components/admin/reports/ReportExportControls'
import ReportsDateRangeToolbar from '@/components/admin/reports/ReportsDateRangeToolbar'
import SummaryReportCards from '@/components/admin/reports/SummaryReportCards'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminReports } from '@/hooks/admin/useAdminReports'
import { formatAdminCurrency } from '@/utils/adminFormatters'

export default function AdminDonationReportsPage() {
  const {
    filteredReports,
    filterOptions,
    filters,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
  } = useAdminReports()
  const trendPoints = filteredReports?.donationTrends[filters.granularity] ?? []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Reports"
          title="Donation Reports"
          description="Review daily, weekly, and monthly donation movement by campaign, status, and payment method."
          actions={
            <>
              {filteredReports && (
                <ReportExportControls
                  reports={filteredReports}
                  granularity={filters.granularity}
                  defaultSection="donations"
                  compact
                />
              )}
              <Button type="button" variant="primary" size="sm" onClick={refetch} disabled={loading} className="gap-2">
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
            </>
          }
        />

        <ReportsDateRangeToolbar
          filters={filters}
          options={filterOptions}
          onChange={updateFilter}
          onClear={clearFilters}
        />

        {error && !loading && <AdminErrorState message={error} onRetry={refetch} />}

        {loading || !filteredReports ? (
          <AdminLoadingState label="Loading donation reports..." />
        ) : (
          <>
            <SummaryReportCards summary={filteredReports.summary} />
            <DonationTrendsChart points={trendPoints} />

            <section className="space-y-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Donation Trend Rows</h2>
                <p className="mt-1 text-sm text-gray-600">CSV-ready rows for the selected date range and trend interval.</p>
              </div>
              <AdminDataTable
                rows={trendPoints}
                getRowKey={(point) => point.id}
                emptyTitle="No donation rows found"
                emptyDescription="Adjust the date range, campaign, payment method, or status filters."
                columns={[
                  { key: 'period', header: 'Period', cell: (point) => point.label },
                  { key: 'count', header: 'Donations', cell: (point) => point.donationCount },
                  { key: 'successful', header: 'Successful', cell: (point) => point.successfulCount },
                  { key: 'pending', header: 'Pending', cell: (point) => point.pendingCount },
                  { key: 'failed', header: 'Failed/Refunded', cell: (point) => point.failedOrRefundedCount },
                  { key: 'amount', header: 'Amount', cell: (point) => formatAdminCurrency(point.amount, 'USD', 0) },
                ]}
              />
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
