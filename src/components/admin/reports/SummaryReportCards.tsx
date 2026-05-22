import { BarChart3, FileText, HeartHandshake, ShoppingBag, Target, Users } from 'lucide-react'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import { formatAdminCurrency } from '@/utils/adminFormatters'
import type { AdminReportSummary } from '@/types/adminReport'

interface SummaryReportCardsProps {
  summary: AdminReportSummary
}

export default function SummaryReportCards({ summary }: SummaryReportCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <AdminStatCard
        label="Donation Revenue"
        value={formatAdminCurrency(summary.donationTotal)}
        icon={<HeartHandshake className="h-5 w-5" />}
        helperText={`${summary.successfulDonationCount} successful gifts`}
      />
      <AdminStatCard
        label="Campaign Progress"
        value={`${summary.campaignProgressPercent}%`}
        icon={<Target className="h-5 w-5" />}
        helperText={`${summary.activeCampaignCount} active campaigns`}
      />
      <AdminStatCard
        label="Donors"
        value={summary.donorCount}
        icon={<Users className="h-5 w-5" />}
        helperText={`${summary.newDonorCount} new in range`}
      />
      <AdminStatCard
        label="Average Donation"
        value={formatAdminCurrency(summary.averageDonation)}
        icon={<BarChart3 className="h-5 w-5" />}
        helperText={`${summary.donationCount} total records`}
      />
      <AdminStatCard
        label="Content Updates"
        value={summary.contentUpdateCount}
        icon={<FileText className="h-5 w-5" />}
        helperText={`${summary.publishedContentCount} published`}
      />
      <AdminStatCard
        label="Product Contribution"
        value={formatAdminCurrency(summary.productContribution)}
        icon={<ShoppingBag className="h-5 w-5" />}
        helperText={`${summary.productConversions} conversions`}
      />
    </div>
  )
}
