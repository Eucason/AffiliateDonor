import { Link } from 'react-router-dom'
import { BarChart3, FileText, HeartHandshake, RefreshCcw, ShoppingBag, Target, Users } from 'lucide-react'
import CampaignPerformanceTable from '@/components/admin/reports/CampaignPerformanceTable'
import ContentPerformanceTable from '@/components/admin/reports/ContentPerformanceTable'
import DonationTrendsChart from '@/components/admin/reports/DonationTrendsChart'
import DonorGrowthChart from '@/components/admin/reports/DonorGrowthChart'
import ProductPerformanceTable from '@/components/admin/reports/ProductPerformanceTable'
import ReportExportControls from '@/components/admin/reports/ReportExportControls'
import ReportsDateRangeToolbar from '@/components/admin/reports/ReportsDateRangeToolbar'
import SummaryReportCards from '@/components/admin/reports/SummaryReportCards'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import Button from '@/components/atoms/Button'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAdminReports } from '@/hooks/admin/useAdminReports'

const reportSections = [
  {
    title: 'Donations',
    description: 'Trends by period, payment status, and method.',
    path: '/admin/reports/donations',
    icon: HeartHandshake,
  },
  {
    title: 'Campaigns',
    description: 'Raised vs goal, donor count, and progress.',
    path: '/admin/reports/campaigns',
    icon: Target,
  },
  {
    title: 'Donors',
    description: 'New donors, returning donors, and averages.',
    path: '/admin/reports/donors',
    icon: Users,
  },
  {
    title: 'Content',
    description: 'Blog and CMS performance signals.',
    path: '/admin/reports/content',
    icon: FileText,
  },
  {
    title: 'Products',
    description: 'Affiliate and merch clicks, conversions, and contribution.',
    path: '/admin/reports/products',
    icon: ShoppingBag,
  },
]

export default function AdminReportsPage() {
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
          title="Reports"
          description="Analyze donations, campaigns, donor growth, content performance, product activity, and exports."
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
          <AdminLoadingState label="Loading reports..." />
        ) : (
          <>
            <SummaryReportCards summary={filteredReports.summary} />

            <section className="space-y-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Report Areas</h2>
                <p className="mt-1 text-sm text-gray-600">Jump into focused reporting pages for deeper review.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {reportSections.map((section) => {
                  const Icon = section.icon

                  return (
                    <Link
                      key={section.path}
                      to={section.path}
                      className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-primary-200 hover:bg-primary-50"
                    >
                      <Icon className="h-5 w-5 text-primary-600" />
                      <h3 className="mt-3 text-sm font-semibold text-gray-900">{section.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{section.description}</p>
                    </Link>
                  )
                })}
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
              <DonationTrendsChart points={filteredReports.donationTrends[filters.granularity]} />
              <DonorGrowthChart points={filteredReports.donorGrowth} />
            </div>

            <section className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Campaign Performance</h2>
                  <p className="mt-1 text-sm text-gray-600">Top campaign progress for the active report range.</p>
                </div>
                <Link to="/admin/reports/campaigns" className="text-sm font-semibold text-primary-700 hover:text-primary-900">
                  View All
                </Link>
              </div>
              <CampaignPerformanceTable campaigns={filteredReports.campaignPerformance.slice(0, 5)} />
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="space-y-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Content Performance</h2>
                  <p className="mt-1 text-sm text-gray-600">Recent content activity and conversion assists.</p>
                </div>
                <ContentPerformanceTable content={filteredReports.contentPerformance.slice(0, 5)} />
              </section>
              <section className="space-y-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Product Performance</h2>
                  <p className="mt-1 text-sm text-gray-600">Commerce contribution and conversion activity.</p>
                </div>
                <ProductPerformanceTable products={filteredReports.productPerformance.slice(0, 5)} />
              </section>
            </div>

            <section className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Exports</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Prepared CSV exports for weekly summaries, monthly summaries, and report tables.
                  </p>
                </div>
                <Link to="/admin/exports" className="text-sm font-semibold text-primary-700 hover:text-primary-900">
                  Open Exports
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {filteredReports.exports.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <BarChart3 className="h-5 w-5 text-gray-500" />
                    <h3 className="mt-3 text-sm font-semibold text-gray-900">{item.label}</h3>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {item.rowCount} rows
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
