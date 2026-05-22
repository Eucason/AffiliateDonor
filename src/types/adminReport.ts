export type AdminReportSection =
  | 'overview'
  | 'donations'
  | 'campaigns'
  | 'donors'
  | 'content'
  | 'products'

export type AdminReportGranularity = 'daily' | 'weekly' | 'monthly'

export interface AdminReportFilters {
  search: string
  dateFrom: string
  dateTo: string
  granularity: AdminReportGranularity
  campaign: string
  donationStatus: string
  paymentMethod: string
  productType: 'all' | 'affiliate' | 'merch'
  contentType: string
}

export interface AdminReportFilterOptions {
  campaigns: string[]
  donationStatuses: string[]
  paymentMethods: string[]
  productTypes: Array<'affiliate' | 'merch'>
  contentTypes: string[]
}

export interface AdminReportSummary {
  donationTotal: number
  donationCount: number
  successfulDonationCount: number
  averageDonation: number
  activeCampaignCount: number
  campaignProgressPercent: number
  donorCount: number
  newDonorCount: number
  returningDonorCount: number
  contentUpdateCount: number
  publishedContentCount: number
  productClicks: number
  productConversions: number
  productContribution: number
}

export interface AdminDonationTrendPoint {
  id: string
  label: string
  date: string
  donationCount: number
  successfulCount: number
  pendingCount: number
  failedOrRefundedCount: number
  amount: number
}

export interface AdminDonationReportRecord {
  id: string
  campaignName: string
  status: string
  method: string
  amount: number
  currency: string
  createdAt: string
}

export interface AdminCampaignPerformanceReport {
  id: string
  name: string
  category: string
  status: string
  raised: number
  goal: number
  currency: string
  donorCount: number
  averageDonation: number
  progressPercent: number
  conversionRate: number
  updatedAt: string
  path: string
}

export interface AdminDonorGrowthPoint {
  id: string
  label: string
  date: string
  newDonors: number
  returningDonors: number
  totalDonors: number
  averageDonation: number
}

export interface AdminContentPerformanceReport {
  id: string
  title: string
  type: string
  status: string
  views: number
  uniqueVisitors: number
  conversionAssists: number
  updatedAt: string
  path: string
}

export interface AdminProductPerformanceReport {
  id: string
  name: string
  type: 'affiliate' | 'merch'
  status: string
  linkedCauseName: string
  clicks: number
  conversions: number
  conversionRate: number
  estimatedContribution: number
  updatedAt: string
  path: string
}

export interface AdminReportExportItem {
  id: string
  label: string
  section: AdminReportSection
  description: string
  rowCount: number
  format: 'csv'
  updatedAt: string
}

export interface AdminReportsResponse {
  generatedAt: string
  summary: AdminReportSummary
  donationRecords: AdminDonationReportRecord[]
  donationTrends: Record<AdminReportGranularity, AdminDonationTrendPoint[]>
  campaignPerformance: AdminCampaignPerformanceReport[]
  donorGrowth: AdminDonorGrowthPoint[]
  contentPerformance: AdminContentPerformanceReport[]
  productPerformance: AdminProductPerformanceReport[]
  exports: AdminReportExportItem[]
  filterOptions: AdminReportFilterOptions
}
