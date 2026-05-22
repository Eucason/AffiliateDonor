import { RefreshCcw } from 'lucide-react'
import ReportExportControls from '@/components/admin/reports/ReportExportControls'
import ReportsDateRangeToolbar from '@/components/admin/reports/ReportsDateRangeToolbar'
import AdminDataTable from '@/components/admin/shared/AdminDataTable'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminReports } from '@/hooks/admin/useAdminReports'
import { formatAdminDateTime } from '@/utils/adminFormatters'

export default function AdminExportsPage() {
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
          eyebrow="Insights"
          title="Exports"
          description="Prepare weekly summaries, monthly summaries, and date range CSV exports from admin reports."
          actions={
            <>
              {filteredReports && (
                <ReportExportControls reports={filteredReports} granularity={filters.granularity} />
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
          <AdminLoadingState label="Loading export options..." />
        ) : (
          <section className="space-y-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Available Exports</h2>
              <p className="mt-1 text-sm text-gray-600">CSV definitions generated from the active report filters.</p>
            </div>
            <AdminDataTable
              rows={filteredReports.exports}
              getRowKey={(item) => item.id}
              emptyTitle="No exports available"
              emptyDescription="Adjust the filters or refresh report data."
              columns={[
                { key: 'label', header: 'Export', cell: (item) => <span className="font-semibold text-gray-900">{item.label}</span> },
                { key: 'section', header: 'Section', cell: (item) => item.section },
                { key: 'description', header: 'Description', cell: (item) => item.description },
                { key: 'rows', header: 'Rows', cell: (item) => item.rowCount },
                { key: 'format', header: 'Format', cell: (item) => item.format.toUpperCase() },
                { key: 'updated', header: 'Generated', cell: (item) => formatAdminDateTime(item.updatedAt) },
              ]}
            />
          </section>
        )}
      </div>
    </AdminLayout>
  )
}
