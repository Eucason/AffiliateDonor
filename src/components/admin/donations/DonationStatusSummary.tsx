import { AlertCircle, Banknote, CheckCircle2, Clock } from 'lucide-react'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import { formatAdminCurrency } from '@/utils/adminFormatters'
import type { AdminDonationSummary } from '@/types/adminDonation'

interface DonationStatusSummaryProps {
  summary: AdminDonationSummary
}

export default function DonationStatusSummary({ summary }: DonationStatusSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Total Contributed"
        value={formatAdminCurrency(summary.totalContributed, 'USD', 0)}
        helperText="Successful payments in the current view"
        icon={<Banknote className="h-5 w-5" />}
      />
      <AdminStatCard
        label="Successful Payments"
        value={summary.successfulCount}
        helperText="Provider-confirmed contributions"
        icon={<CheckCircle2 className="h-5 w-5" />}
      />
      <AdminStatCard
        label="Pending Payments"
        value={summary.pendingCount}
        helperText="Needs provider confirmation"
        icon={<Clock className="h-5 w-5" />}
      />
      <AdminStatCard
        label="Failed / Refunded"
        value={summary.failedOrRefundedCount}
        helperText="Payments requiring review"
        icon={<AlertCircle className="h-5 w-5" />}
      />
    </div>
  )
}
