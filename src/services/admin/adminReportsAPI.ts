import apiClient from '@/lib/apiClient'
import type {
  AdminCampaignPerformanceReport,
  AdminContentPerformanceReport,
  AdminDonationReportRecord,
  AdminDonationTrendPoint,
  AdminDonorGrowthPoint,
  AdminProductPerformanceReport,
  AdminReportExportItem,
  AdminReportFilterOptions,
  AdminReportGranularity,
  AdminReportSummary,
  AdminReportsResponse,
} from '@/types/adminReport'

const granularityValues: AdminReportGranularity[] = ['daily', 'weekly', 'monthly']

export const adminReportsAPI = {
  async getReports(): Promise<AdminReportsResponse> {
    try {
      const response = await apiClient.get<AdminReportsResponse>('/api/admin/reports', { timeout: 2500 })
      return normalizeReportsResponse(response.data)
    } catch (error) {
      console.warn('Using admin reports fallback data because the API could not be reached.', error)
      return buildFallbackReports()
    }
  },

  async getExports(): Promise<AdminReportExportItem[]> {
    try {
      const response = await apiClient.get<{ exports: AdminReportExportItem[] }>('/api/admin/exports', { timeout: 2500 })
      return response.data.exports
    } catch (error) {
      console.warn('Using admin export fallback data because the API could not be reached.', error)
      return buildFallbackReports().exports
    }
  },
}

function buildFallbackReports(): AdminReportsResponse {
  const donationRecords = fallbackDonationRecords()
  const donationTrends = buildDonationTrends(donationRecords)
  const campaignPerformance = fallbackCampaignPerformance()
  const donorGrowth = fallbackDonorGrowth()
  const contentPerformance = fallbackContentPerformance()
  const productPerformance = fallbackProductPerformance()
  const summary = summarizeReports({
    donationTrends: donationTrends.daily,
    campaignPerformance,
    donorGrowth,
    contentPerformance,
    productPerformance,
  })
  const filterOptions = buildFilterOptions(
    donationRecords,
    campaignPerformance,
    productPerformance,
    contentPerformance,
  )

  return {
    generatedAt: new Date().toISOString(),
    summary,
    donationRecords,
    donationTrends,
    campaignPerformance,
    donorGrowth,
    contentPerformance,
    productPerformance,
    exports: buildExportItems(summary, {
      donationTrends: donationTrends.daily,
      campaignPerformance,
      donorGrowth,
      contentPerformance,
      productPerformance,
    }),
    filterOptions,
  }
}

export function summarizeReports(data: {
  donationTrends: AdminDonationTrendPoint[]
  campaignPerformance: AdminCampaignPerformanceReport[]
  donorGrowth: AdminDonorGrowthPoint[]
  contentPerformance: AdminContentPerformanceReport[]
  productPerformance: AdminProductPerformanceReport[]
}): AdminReportSummary {
  const donationTotal = data.donationTrends.reduce((total, point) => total + point.amount, 0)
  const donationCount = data.donationTrends.reduce((total, point) => total + point.donationCount, 0)
  const successfulDonationCount = data.donationTrends.reduce((total, point) => total + point.successfulCount, 0)
  const campaignRaised = data.campaignPerformance.reduce((total, campaign) => total + campaign.raised, 0)
  const campaignGoal = data.campaignPerformance.reduce((total, campaign) => total + campaign.goal, 0)
  const latestDonorPoint = [...data.donorGrowth].sort(
    (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime(),
  )[0]

  return {
    donationTotal,
    donationCount,
    successfulDonationCount,
    averageDonation: donationCount > 0 ? donationTotal / donationCount : 0,
    activeCampaignCount: data.campaignPerformance.filter((campaign) => campaign.status === 'active').length,
    campaignProgressPercent: campaignGoal > 0 ? Math.round((campaignRaised / campaignGoal) * 100) : 0,
    donorCount: latestDonorPoint?.totalDonors ?? 0,
    newDonorCount: data.donorGrowth.reduce((total, point) => total + point.newDonors, 0),
    returningDonorCount: data.donorGrowth.reduce((total, point) => total + point.returningDonors, 0),
    contentUpdateCount: data.contentPerformance.length,
    publishedContentCount: data.contentPerformance.filter((item) => item.status === 'published').length,
    productClicks: data.productPerformance.reduce((total, product) => total + product.clicks, 0),
    productConversions: data.productPerformance.reduce((total, product) => total + product.conversions, 0),
    productContribution: data.productPerformance.reduce((total, product) => total + product.estimatedContribution, 0),
  }
}

export function buildExportItems(
  summary: AdminReportSummary,
  data: {
    donationTrends: AdminDonationTrendPoint[]
    campaignPerformance: AdminCampaignPerformanceReport[]
    donorGrowth: AdminDonorGrowthPoint[]
    contentPerformance: AdminContentPerformanceReport[]
    productPerformance: AdminProductPerformanceReport[]
  },
): AdminReportExportItem[] {
  const updatedAt = new Date().toISOString()

  return [
    {
      id: 'export-weekly-summary',
      label: 'Weekly Summary',
      section: 'overview',
      description: `${summary.donationCount} donations, ${summary.productConversions} product conversions, and ${summary.contentUpdateCount} content updates.`,
      rowCount: 1,
      format: 'csv',
      updatedAt,
    },
    {
      id: 'export-monthly-summary',
      label: 'Monthly Summary',
      section: 'overview',
      description: `${summary.activeCampaignCount} active campaigns with ${summary.campaignProgressPercent}% combined progress.`,
      rowCount: 1,
      format: 'csv',
      updatedAt,
    },
    {
      id: 'export-donations',
      label: 'Donation Trends',
      section: 'donations',
      description: 'Date range donation totals, status counts, and trend amounts.',
      rowCount: data.donationTrends.length,
      format: 'csv',
      updatedAt,
    },
    {
      id: 'export-campaigns',
      label: 'Campaign Performance',
      section: 'campaigns',
      description: 'Raised totals, goals, donor counts, and campaign progress.',
      rowCount: data.campaignPerformance.length,
      format: 'csv',
      updatedAt,
    },
    {
      id: 'export-donors',
      label: 'Donor Growth',
      section: 'donors',
      description: 'New donor, returning donor, and average donation trend data.',
      rowCount: data.donorGrowth.length,
      format: 'csv',
      updatedAt,
    },
    {
      id: 'export-content',
      label: 'Content Performance',
      section: 'content',
      description: 'Blog and website content update, view, and conversion assist data.',
      rowCount: data.contentPerformance.length,
      format: 'csv',
      updatedAt,
    },
    {
      id: 'export-products',
      label: 'Product Performance',
      section: 'products',
      description: 'Affiliate and merch click, conversion, and contribution metrics.',
      rowCount: data.productPerformance.length,
      format: 'csv',
      updatedAt,
    },
  ]
}

function fallbackDonationRecords(): AdminDonationReportRecord[] {
  return [
    donationRecord('don-1048', 'Clean Water Initiative', 'successful', 'Card', 250, 18),
    donationRecord('don-1047', 'Education for All', 'successful', 'PayPal', 75, 54),
    donationRecord('don-1046', 'Healthcare Access', 'pending', 'Crypto', 120, 92),
    donationRecord('don-1045', 'Hunger Relief', 'failed', 'Card', 50, 140),
    donationRecord('don-1044', 'Clean Water Initiative', 'successful', 'Bank Transfer', 500, 320),
    donationRecord('don-1043', 'Wildlife Conservation', 'refunded', 'Card', 35, 980),
    donationRecord('don-1042', 'Education for All', 'successful', 'Card', 180, 1260),
    donationRecord('don-1041', 'Healthcare Access', 'pending', 'PayPal', 95, 1680),
  ]
}

function fallbackCampaignPerformance(): AdminCampaignPerformanceReport[] {
  return [
    campaignReport('1', 'Clean Water Initiative', 'Environment', 'active', 125000, 200000, 1234, 250, 62, 75, 4),
    campaignReport('2', 'Education for All', 'Education', 'active', 85000, 150000, 892, 127, 57, 68, 18),
    campaignReport('3', 'Wildlife Conservation', 'Environment', 'active', 95000, 120000, 1567, 220, 79, 79, 30),
    campaignReport('4', 'Hunger Relief', 'Humanitarian', 'pending', 165000, 250000, 2341, 50, 66, 84, 52),
    campaignReport('5', 'Healthcare Access', 'Health', 'draft', 142000, 200000, 1876, 138, 71, 82, 74),
  ]
}

function fallbackDonorGrowth(): AdminDonorGrowthPoint[] {
  return [
    donorGrowthPoint('donor-2025-08', 'Aug 2025', -9, 1, 1, 1, 250),
    donorGrowthPoint('donor-2025-12', 'Dec 2025', -5, 2, 2, 3, 185),
    donorGrowthPoint('donor-2026-01', 'Jan 2026', -4, 2, 2, 5, 172),
    donorGrowthPoint('donor-2026-02', 'Feb 2026', -3, 1, 1, 6, 120),
    donorGrowthPoint('donor-2026-04', 'Apr 2026', -1, 2, 1, 8, 138),
  ]
}

function fallbackContentPerformance(): AdminContentPerformanceReport[] {
  return [
    contentReport('blog-101', '10 Ways to Make Your Shopping More Impactful', 'blog_post', 'published', 18420, 13262, 221, daysAgo(9), '/admin/blogs/edit/blog-101'),
    contentReport('blog-102', 'How We Verify Our Charitable Partners', 'blog_post', 'published', 12780, 9202, 153, daysAgo(18), '/admin/blogs/edit/blog-102'),
    contentReport('content-home-hero', 'Homepage Hero', 'homepage_hero', 'published', 4120, 2802, 74, hoursAgo(6), '/admin/content/homepage'),
    contentReport('content-banner-giving-week', 'Spring Giving Week', 'announcement', 'scheduled', 0, 0, 0, hoursAgo(10), '/admin/content/banners'),
    contentReport('content-impact-water', 'Clean Water Access in Kisumu', 'impact_story', 'published', 3050, 2074, 55, hoursAgo(18), '/admin/content/impact-stories'),
    contentReport('content-testimonial-donor', 'Maya Thompson', 'testimonial', 'published', 2600, 1768, 47, hoursAgo(48), '/admin/content/testimonials'),
  ]
}

function fallbackProductPerformance(): AdminProductPerformanceReport[] {
  return [
    productReport('p1', 'Eco-Friendly Water Bottle', 'affiliate', 'published', 'Clean Water Initiative', 1324, 86, 2140, 5),
    productReport('p2', 'Solar Power Bank', 'affiliate', 'published', 'Climate Action', 788, 44, 1630, 28),
    productReport('p3', 'Organic Cotton Tote', 'affiliate', 'draft', 'Education for All', 142, 0, 0, 64),
    productReport('merch-1', 'AffiliateDonor T-Shirt', 'merch', 'published', 'Education for All', 942, 117, 2925, 9),
    productReport('merch-2', 'Impact Hoodie', 'merch', 'published', 'Hunger Relief', 391, 26, 530, 16),
    productReport('merch-3', 'Donor Sticker Pack', 'merch', 'archived', 'Clean Water Initiative', 121, 18, 58, 92),
  ]
}

function buildDonationTrends(records: AdminDonationReportRecord[]) {
  return granularityValues.reduce<Record<AdminReportGranularity, AdminDonationTrendPoint[]>>(
    (trends, granularity) => {
      trends[granularity] = groupDonationsByGranularity(records, granularity)
      return trends
    },
    {
      daily: [],
      weekly: [],
      monthly: [],
    },
  )
}

function groupDonationsByGranularity(
  records: AdminDonationReportRecord[],
  granularity: AdminReportGranularity,
): AdminDonationTrendPoint[] {
  const groups = new Map<string, AdminDonationTrendPoint>()

  records.forEach((record) => {
    const date = new Date(record.createdAt)
    const groupDate = getGroupDate(date, granularity)
    const groupKey = groupDate.toISOString().slice(0, 10)
    const existing = groups.get(groupKey) ?? {
      id: `${granularity}-${groupKey}`,
      label: formatTrendLabel(groupDate, granularity),
      date: groupKey,
      donationCount: 0,
      successfulCount: 0,
      pendingCount: 0,
      failedOrRefundedCount: 0,
      amount: 0,
    }

    existing.donationCount += 1
    existing.amount += record.status === 'successful' ? record.amount : 0
    existing.successfulCount += record.status === 'successful' ? 1 : 0
    existing.pendingCount += record.status === 'pending' ? 1 : 0
    existing.failedOrRefundedCount += record.status === 'failed' || record.status === 'refunded' ? 1 : 0
    groups.set(groupKey, existing)
  })

  return Array.from(groups.values()).sort(
    (first, second) => new Date(first.date).getTime() - new Date(second.date).getTime(),
  )
}

function buildFilterOptions(
  donations: AdminDonationReportRecord[],
  campaigns: AdminCampaignPerformanceReport[],
  products: AdminProductPerformanceReport[],
  contentPerformance: AdminContentPerformanceReport[],
): AdminReportFilterOptions {
  return {
    campaigns: uniqueSorted([
      ...donations.map((donation) => donation.campaignName),
      ...campaigns.map((campaign) => campaign.name),
      ...products.map((product) => product.linkedCauseName),
    ]),
    donationStatuses: uniqueSorted(donations.map((donation) => donation.status)),
    paymentMethods: uniqueSorted(donations.map((donation) => donation.method)),
    productTypes: ['affiliate', 'merch'],
    contentTypes: uniqueSorted(contentPerformance.map((item) => item.type)),
  }
}

function normalizeReportsResponse(response: AdminReportsResponse): AdminReportsResponse {
  return {
    ...response,
    donationRecords: response.donationRecords ?? [],
    donationTrends: {
      daily: response.donationTrends?.daily ?? [],
      weekly: response.donationTrends?.weekly ?? [],
      monthly: response.donationTrends?.monthly ?? [],
    },
    campaignPerformance: response.campaignPerformance ?? [],
    donorGrowth: response.donorGrowth ?? [],
    contentPerformance: response.contentPerformance ?? [],
    productPerformance: response.productPerformance ?? [],
    exports: response.exports ?? [],
    filterOptions: response.filterOptions ?? {
      campaigns: [],
      donationStatuses: [],
      paymentMethods: [],
      productTypes: ['affiliate', 'merch'],
      contentTypes: [],
    },
  }
}

function donationRecord(
  id: string,
  campaignName: string,
  status: string,
  method: string,
  amount: number,
  minutesAgo: number,
): AdminDonationReportRecord {
  return {
    id,
    campaignName,
    status,
    method,
    amount,
    currency: 'USD',
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  }
}

function campaignReport(
  id: string,
  name: string,
  category: string,
  status: string,
  raised: number,
  goal: number,
  donorCount: number,
  averageDonation: number,
  progressPercent: number,
  conversionRate: number,
  updatedHoursAgo: number,
): AdminCampaignPerformanceReport {
  return {
    id,
    name,
    category,
    status,
    raised,
    goal,
    currency: 'USD',
    donorCount,
    averageDonation,
    progressPercent,
    conversionRate,
    updatedAt: hoursAgo(updatedHoursAgo),
    path: `/admin/causes/${id}`,
  }
}

function donorGrowthPoint(
  id: string,
  label: string,
  monthOffset: number,
  newDonors: number,
  returningDonors: number,
  totalDonors: number,
  averageDonation: number,
): AdminDonorGrowthPoint {
  const date = new Date()
  date.setMonth(date.getMonth() + monthOffset)
  date.setDate(1)

  return {
    id,
    label,
    date: date.toISOString().slice(0, 10),
    newDonors,
    returningDonors,
    totalDonors,
    averageDonation,
  }
}

function contentReport(
  id: string,
  title: string,
  type: string,
  status: string,
  views: number,
  uniqueVisitors: number,
  conversionAssists: number,
  updatedAt: string,
  path: string,
): AdminContentPerformanceReport {
  return {
    id,
    title,
    type,
    status,
    views,
    uniqueVisitors,
    conversionAssists,
    updatedAt,
    path,
  }
}

function productReport(
  id: string,
  name: string,
  type: 'affiliate' | 'merch',
  status: string,
  linkedCauseName: string,
  clicks: number,
  conversions: number,
  estimatedContribution: number,
  updatedHoursAgo: number,
): AdminProductPerformanceReport {
  return {
    id,
    name,
    type,
    status,
    linkedCauseName,
    clicks,
    conversions,
    conversionRate: clicks > 0 ? Math.round((conversions / clicks) * 1000) / 10 : 0,
    estimatedContribution,
    updatedAt: hoursAgo(updatedHoursAgo),
    path: `/admin/products/${id}/edit`,
  }
}

function getGroupDate(date: Date, granularity: AdminReportGranularity) {
  if (granularity === 'monthly') {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  if (granularity === 'weekly') {
    const groupDate = new Date(date)
    const day = groupDate.getDay()
    const offset = day === 0 ? -6 : 1 - day
    groupDate.setDate(groupDate.getDate() + offset)
    groupDate.setHours(0, 0, 0, 0)
    return groupDate
  }

  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  return dayStart
}

function formatTrendLabel(date: Date, granularity: AdminReportGranularity) {
  if (granularity === 'monthly') {
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
  }

  if (granularity === 'weekly') {
    return `Week of ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)}`
  }

  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function uniqueSorted<T extends string>(values: T[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((first, second) => first.localeCompare(second))
}
