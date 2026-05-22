import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink, Mail, Package } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AdminErrorState from '@/components/admin/shared/AdminErrorState'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'
import AdminPageHeader from '@/components/admin/shared/AdminPageHeader'
import AdminSectionCard from '@/components/admin/shared/AdminSectionCard'
import AdminNotesPanel from '@/components/admin/users/AdminNotesPanel'
import DonorActivityTimeline from '@/components/admin/users/DonorActivityTimeline'
import DonorDonationHistory from '@/components/admin/users/DonorDonationHistory'
import DonorProfileHeader from '@/components/admin/users/DonorProfileHeader'
import RoleSelector from '@/components/admin/users/RoleSelector'
import AdminLayout from '@/components/organisms/AdminLayout'
import { useAuth } from '@/context/AuthContext'
import { hasAdminPermission } from '@/config/adminPermissions'
import { adminUsersAPI } from '@/services/admin/adminUsersAPI'
import { formatAdminCurrency, formatAdminDateTime } from '@/utils/adminFormatters'
import type { AdminUser, AdminUserRole } from '@/types/adminUser'

export default function AdminUserDetailsPage() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const canManageRoles = hasAdminPermission(currentUser, 'users:write')

  const fetchProfile = useCallback(async () => {
    if (!id) {
      setError('User ID is missing.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setProfile(await adminUsersAPI.getUser(id))
    } catch (requestError) {
      console.error('Failed to load user detail:', requestError)
      setError('This user profile could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateRole = async (role: AdminUserRole) => {
    if (!profile) {
      return
    }

    setProfile(await adminUsersAPI.updateRole(profile.id, role))
  }

  const addNote = async (body: string) => {
    if (!profile) {
      return
    }

    setProfile(await adminUsersAPI.addNote(profile.id, body))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-primary-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to users
        </Link>

        {loading && <AdminLoadingState label="Loading user profile..." />}

        {error && !loading && <AdminErrorState message={error} onRetry={fetchProfile} />}

        {profile && !loading && !error && (
          <>
            <AdminPageHeader
              eyebrow="User Profile"
              title={profile.name}
              description="Donor history, role assignment, activity, product interactions, contact links, and admin notes."
              actions={
                <>
                  <Link
                    to={`/admin/messages?email=${encodeURIComponent(profile.email)}`}
                    className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Messages
                  </Link>
                  <Link
                    to={`/admin/donations?campaign=all&status=all&method=all&search=${encodeURIComponent(profile.email)}`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Donation Records
                  </Link>
                </>
              }
            />

            <DonorProfileHeader user={profile} />

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.8fr)]">
              <div className="space-y-6">
                <AdminSectionCard title="Donation History" description="Campaign-linked donation records and export controls.">
                  <DonorDonationHistory user={profile} />
                </AdminSectionCard>

                <AdminSectionCard title="Activity Timeline">
                  <DonorActivityTimeline activity={profile.activity} />
                </AdminSectionCard>
              </div>

              <div className="space-y-6">
                <AdminSectionCard title="Role">
                  <RoleSelector value={profile.role} canManage={canManageRoles} onChange={updateRole} />
                </AdminSectionCard>

                <AdminSectionCard title="Product & Affiliate Activity">
                  {profile.productActivity.length > 0 ? (
                    <div className="space-y-3">
                      {profile.productActivity.map((item) => (
                        <div key={item.id} className="rounded-lg border border-gray-200 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900">{item.label}</p>
                              <p className="text-xs text-gray-500">{formatAdminDateTime(item.createdAt)}</p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                              <Package className="mr-1 h-3.5 w-3.5" />
                              {item.type}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">
                            Tracked value {formatAdminCurrency(item.value, 'USD')}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                      No product or affiliate activity is connected to this user yet.
                    </p>
                  )}
                </AdminSectionCard>

                <AdminSectionCard title="Admin Notes">
                  <AdminNotesPanel notes={profile.notes} onAddNote={addNote} />
                </AdminSectionCard>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
