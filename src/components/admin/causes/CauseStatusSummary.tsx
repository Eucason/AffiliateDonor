import { Archive, CircleDollarSign, FileText, RadioTower } from 'lucide-react'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import { formatAdminCurrency } from '@/utils/adminFormatters'
import type { AdminCauseSummary } from '@/types/adminCause'

interface CauseStatusSummaryProps {
  summary: AdminCauseSummary
}

export default function CauseStatusSummary({ summary }: CauseStatusSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard
        label="Active Campaigns"
        value={summary.activeCount}
        helperText="Published and accepting support"
        icon={<RadioTower className="h-5 w-5" />}
      />
      <AdminStatCard
        label="Draft Campaigns"
        value={summary.draftCount}
        helperText="In progress or pending copy"
        icon={<FileText className="h-5 w-5" />}
      />
      <AdminStatCard
        label="Archived"
        value={summary.archivedCount}
        helperText="Closed campaigns retained for reporting"
        icon={<Archive className="h-5 w-5" />}
      />
      <AdminStatCard
        label="Total Raised"
        value={formatAdminCurrency(summary.totalRaised, 'USD', 0)}
        helperText={`Goal pool ${formatAdminCurrency(summary.totalGoal, 'USD', 0)}`}
        icon={<CircleDollarSign className="h-5 w-5" />}
      />
    </div>
  )
}
