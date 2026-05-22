import { Download, RefreshCw, Shield, UserCheck, UserRound, Users } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSearchInput from '@/components/admin/shared/AdminSearchInput'
import AdminStatCard from '@/components/admin/shared/AdminStatCard'
import AdminTableToolbar from '@/components/admin/shared/AdminTableToolbar'
import UserFilters from '@/components/admin/users/UserFilters'
import UsersTable from '@/components/admin/users/UsersTable'
import AdminLayout from '@/components/organisms/AdminLayout'
import Button from '@/components/atoms/Button'
import { buildCsv, downloadCsv } from '@/utils/adminExport'
import { formatAdminCurrency } from '@/utils/adminFormatters'
import { defaultAdminUserFilters, useAdminUsers } from '@/hooks/admin/useAdminUsers'
import type { AdminUserFilters } from '@/types/adminUser'

export default function AdminUsersPage() {
  const [searchParams] = useSearchParams()
  const initialFilters = useMemo(() => getInitialFilters(searchParams), [searchParams])
  const {
    filteredUsers,
    filterOptions,
    filters,
    summary,
    loading,
    error,
    refetch,
    updateFilter,
    clearFilters,
  } = useAdminUsers(initialFilters)

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([key, value]) => value !== defaultAdminUserFilters[key as keyof AdminUserFilters]),
    [filters],
  )

  const exportUsers = () => {
    const csv = buildCsv(filteredUsers, [
      { header: 'User ID', value: (user) => user.id },
      { header: 'Name', value: (user) => user.name },
      { header: 'Email', value: (user) => user.email },
      { header: 'Role', value: (user) => user.role },
      { header: 'Status', value: (user) => user.status },
      { header: 'Total Donations', value: (user) => user.totalDonations },
      { header: 'Purchases', value: (user) => user.totalPurchases },
      { header: 'Causes Supported', value: (user) => user.supportedCauses.join('; ') },
      { header: 'Joined At', value: (user) => user.joinedAt },
      { header: 'Last Active At', value: (user) => user.lastActiveAt },
    ])

    downloadCsv(`admin-users-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Community"
          title="Users & Donors"
          description="Review donor profiles, donation history, activity, notes, and role assignment foundations."
          actions={
            <>
              <Button type="button" variant="outline" size="sm" onClick={exportUsers} disabled={filteredUsers.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={refetch}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Total Users"
            value={summary.totalUsers.toLocaleString()}
            helperText="All platform accounts in view"
            icon={<Users className="h-5 w-5" />}
          />
          <AdminStatCard
            label="Donors"
            value={summary.donorCount.toLocaleString()}
            helperText="Users with donation history"
            icon={<UserCheck className="h-5 w-5" />}
          />
          <AdminStatCard
            label="Admins"
            value={summary.adminCount.toLocaleString()}
            helperText="Users with admin roles"
            icon={<Shield className="h-5 w-5" />}
          />
          <AdminStatCard
            label="Inactive"
            value={summary.inactiveCount.toLocaleString()}
            helperText={formatAdminCurrency(summary.totalDonations, 'USD', 0)}
            icon={<UserRound className="h-5 w-5" />}
          />
        </div>

        <AdminTableToolbar
          title="User Records"
          description="Search by name, email, user ID, role, or supported cause."
          searchSlot={
            <AdminSearchInput
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              onClear={() => updateFilter('search', '')}
              placeholder="Search users and donors..."
            />
          }
          actions={<span className="text-sm font-medium text-gray-500">{filteredUsers.length} visible</span>}
        />

        <UserFilters filters={filters} options={filterOptions} onChange={updateFilter} onClear={clearFilters} />

        {error && !loading && <AdminErrorState message={error} onRetry={refetch} />}

        <UsersTable users={filteredUsers} isLoading={loading} hasActiveFilters={hasActiveFilters} />
      </div>
    </AdminLayout>
  )
}

function getInitialFilters(searchParams: URLSearchParams): Partial<AdminUserFilters> {
  return {
    role: getQueryValue(searchParams, 'role', defaultAdminUserFilters.role),
    donorState: getQueryValue(searchParams, 'donorState', defaultAdminUserFilters.donorState),
    cause: getQueryValue(searchParams, 'cause', defaultAdminUserFilters.cause),
    activityStatus: getQueryValue(searchParams, 'activityStatus', defaultAdminUserFilters.activityStatus),
  }
}

function getQueryValue<Key extends keyof AdminUserFilters>(
  searchParams: URLSearchParams,
  key: Key,
  fallback: AdminUserFilters[Key],
) {
  return (searchParams.get(key) ?? fallback) as AdminUserFilters[Key]
}
