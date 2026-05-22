import { RefreshCcw } from 'lucide-react'
import DonorGrowthChart from '@/components/admin/reports/DonorGrowthChart'
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

export default function AdminDonorReportsPage() {
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Reports"
          title="Donor Reports"
          description="Track donor acquisition, returning donor activity, donor base growth, and giving averages."
          actions={
            <>
              {filteredReports && (
                <ReportExportControls
                  reports={filteredReports}
                  granularity={filters.granularity}
                  defaultSection="donors"
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
          <AdminLoadingState label="Loading donor reports..." />
        ) : (
          <>
            <SummaryReportCards summary={filteredReports.summary} />
            <DonorGrowthChart points={filteredReports.donorGrowth} />

            <section className="space-y-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Donor Growth Rows</h2>
                <p className="mt-1 text-sm text-gray-600">New donors, returning donors, total donors, and average gift values.</p>
              </div>
              <AdminDataTable
                rows={filteredReports.donorGrowth}
                getRowKey={(point) => point.id}
                emptyTitle="No donor growth rows found"
                emptyDescription="Adjust the date range to include donor activity."
                columns={[
                  { key: 'period', header: 'Period', cell: (point) => point.label },
                  { key: 'new', header: 'New Donors', cell: (point) => point.newDonors },
                  { key: 'returning', header: 'Returning', cell: (point) => point.returningDonors },
                  { key: 'total', header: 'Total Donors', cell: (point) => point.totalDonors },
                  { key: 'average', header: 'Average Gift', cell: (point) => formatAdminCurrency(point.averageDonation, 'USD', 0) },
                ]}
              />
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
