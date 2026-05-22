import { useState } from 'react'
import { Download } from 'lucide-react'
import Button from '@/components/atoms/Button'
import { buildCsv, downloadCsv } from '@/utils/adminExport'
import type {
  AdminReportGranularity,
  AdminReportSection,
  AdminReportsResponse,
} from '@/types/adminReport'

interface ReportExportControlsProps {
  reports: AdminReportsResponse
  granularity: AdminReportGranularity
  defaultSection?: AdminReportSection
  compact?: boolean
}

const exportSections: Array<{ value: AdminReportSection; label: string }> = [
  { value: 'overview', label: 'Summary' },
  { value: 'donations', label: 'Donations' },
  { value: 'campaigns', label: 'Campaigns' },
  { value: 'donors', label: 'Donors' },
  { value: 'content', label: 'Content' },
  { value: 'products', label: 'Products' },
]

export default function ReportExportControls({
  reports,
  granularity,
  defaultSection = 'overview',
  compact = false,
}: ReportExportControlsProps) {
  const [section, setSection] = useState<AdminReportSection>(defaultSection)

  const handleDownload = (targetSection: AdminReportSection = section, labelPrefix = 'admin-report') => {
    const csv = buildSectionCsv(reports, targetSection, granularity)
    downloadCsv(`${labelPrefix}-${targetSection}-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!compact && (
        <select
          value={section}
          onChange={(event) => setSection(event.target.value as AdminReportSection)}
          className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          aria-label="Select report export"
        >
          {exportSections.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      )}
      <Button type="button" variant="outline" size="sm" onClick={() => handleDownload()} className="gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
      {!compact && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleDownload('overview', 'weekly-summary')}
          >
            Weekly Summary
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleDownload('overview', 'monthly-summary')}
          >
            Monthly Summary
          </Button>
        </>
      )}
    </div>
  )
}

function buildSectionCsv(
  reports: AdminReportsResponse,
  section: AdminReportSection,
  granularity: AdminReportGranularity,
) {
  switch (section) {
    case 'donations':
      return buildCsv(reports.donationTrends[granularity], [
        { header: 'Period', value: (row) => row.label },
        { header: 'Date', value: (row) => row.date },
        { header: 'Donation Count', value: (row) => row.donationCount },
        { header: 'Successful', value: (row) => row.successfulCount },
        { header: 'Pending', value: (row) => row.pendingCount },
        { header: 'Failed Or Refunded', value: (row) => row.failedOrRefundedCount },
        { header: 'Amount', value: (row) => row.amount },
      ])
    case 'campaigns':
      return buildCsv(reports.campaignPerformance, [
        { header: 'Campaign', value: (row) => row.name },
        { header: 'Category', value: (row) => row.category },
        { header: 'Status', value: (row) => row.status },
        { header: 'Raised', value: (row) => row.raised },
        { header: 'Goal', value: (row) => row.goal },
        { header: 'Donors', value: (row) => row.donorCount },
        { header: 'Progress Percent', value: (row) => row.progressPercent },
      ])
    case 'donors':
      return buildCsv(reports.donorGrowth, [
        { header: 'Period', value: (row) => row.label },
        { header: 'Date', value: (row) => row.date },
        { header: 'New Donors', value: (row) => row.newDonors },
        { header: 'Returning Donors', value: (row) => row.returningDonors },
        { header: 'Total Donors', value: (row) => row.totalDonors },
        { header: 'Average Donation', value: (row) => row.averageDonation },
      ])
    case 'content':
      return buildCsv(reports.contentPerformance, [
        { header: 'Title', value: (row) => row.title },
        { header: 'Type', value: (row) => row.type },
        { header: 'Status', value: (row) => row.status },
        { header: 'Views', value: (row) => row.views },
        { header: 'Unique Visitors', value: (row) => row.uniqueVisitors },
        { header: 'Conversion Assists', value: (row) => row.conversionAssists },
      ])
    case 'products':
      return buildCsv(reports.productPerformance, [
        { header: 'Product', value: (row) => row.name },
        { header: 'Type', value: (row) => row.type },
        { header: 'Status', value: (row) => row.status },
        { header: 'Cause', value: (row) => row.linkedCauseName },
        { header: 'Clicks', value: (row) => row.clicks },
        { header: 'Conversions', value: (row) => row.conversions },
        { header: 'Estimated Contribution', value: (row) => row.estimatedContribution },
      ])
    case 'overview':
    default:
      return buildCsv([reports.summary], [
        { header: 'Donation Total', value: (row) => row.donationTotal },
        { header: 'Donation Count', value: (row) => row.donationCount },
        { header: 'Average Donation', value: (row) => row.averageDonation },
        { header: 'Campaign Progress Percent', value: (row) => row.campaignProgressPercent },
        { header: 'Donor Count', value: (row) => row.donorCount },
        { header: 'Content Updates', value: (row) => row.contentUpdateCount },
        { header: 'Product Clicks', value: (row) => row.productClicks },
        { header: 'Product Conversions', value: (row) => row.productConversions },
        { header: 'Product Contribution', value: (row) => row.productContribution },
      ])
  }
}
