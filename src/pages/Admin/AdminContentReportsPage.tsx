import { RefreshCcw } from 'lucide-react'
import ContentPerformanceTable from '@/components/admin/reports/ContentPerformanceTable'
import ReportExportControls from '@/components/admin/reports/ReportExportControls'
import ReportsDateRangeToolbar from '@/components/admin/reports/ReportsDateRangeToolbar'
import SummaryReportCards from '@/components/admin/reports/SummaryReportCards'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminReports } from '@/hooks/admin/useAdminReports'

export default function AdminContentReportsPage() {
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
          title="Content Reports"
          description="Review blog and website content updates, views, visitors, and conversion assists."
          actions={
            <>
              {filteredReports && (
                <ReportExportControls
                  reports={filteredReports}
                  granularity={filters.granularity}
                  defaultSection="content"
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
          <AdminLoadingState label="Loading content reports..." />
        ) : (
          <>
            <SummaryReportCards summary={filteredReports.summary} />
            <section className="space-y-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Content Performance</h2>
                <p className="mt-1 text-sm text-gray-600">Blog posts and CMS blocks with engagement and assist signals.</p>
              </div>
              <ContentPerformanceTable content={filteredReports.contentPerformance} />
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
