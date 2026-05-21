import { BarChart3, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/components/organisms/AdminLayout'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminMetricChart from '@/components/admin/shared/AdminMetricChart'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import CampaignProgressOverview from '@/components/admin/dashboard/CampaignProgressOverview'
import ContentActivityCard from '@/components/admin/dashboard/ContentActivityCard'
import DashboardKpiGrid from '@/components/admin/dashboard/DashboardKpiGrid'
import PendingActionsCard from '@/components/admin/dashboard/PendingActionsCard'
import ProductAffiliateActivityCard from '@/components/admin/dashboard/ProductAffiliateActivityCard'
import QuickActionsCard from '@/components/admin/dashboard/QuickActionsCard'
import RecentDonationsCard from '@/components/admin/dashboard/RecentDonationsCard'
import RecentMessagesCard from '@/components/admin/dashboard/RecentMessagesCard'
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard'

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useAdminDashboard()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Platform Overview"
          title="Admin Dashboard"
          description="A command center for donations, campaigns, donors, content, products, messages, and pending reviews."
          actions={
            <>
              <button
                type="button"
                onClick={refetch}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>
              <Link
                to="/admin/reports"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </>
          }
        />

        {loading && <AdminLoadingState label="Loading platform dashboard..." />}

        {error && !loading && <AdminErrorState message={error} onRetry={refetch} />}

        {data && !loading && !error && (
          <>
            <DashboardKpiGrid metrics={data.metrics} />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
              <div className="space-y-6">
                <AdminMetricChart
                  title="Donation Trends"
                  description="Weekly contribution volume, payment status, and donation source mix will live here."
                />
                <CampaignProgressOverview campaigns={data.campaigns} />
                <RecentDonationsCard donations={data.recentDonations} />
              </div>

              <div className="space-y-6">
                <PendingActionsCard actions={data.pendingActions} />
                <QuickActionsCard />
                <RecentMessagesCard messages={data.recentMessages} />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <ContentActivityCard items={data.contentActivity} />
              <ProductAffiliateActivityCard activity={data.productActivity} />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
