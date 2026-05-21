import { useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { hasAdminAccess } from '@/config/adminPermissions'
import AdminLoadingState from '@/components/admin/shared/AdminLoadingState'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const canAccessRoute = isAdminRoute ? hasAdminAccess(user) : Boolean(user)

  useEffect(() => {
    if (!loading && !canAccessRoute) {
      navigate('/')
    }
  }, [loading, canAccessRoute, navigate])

  if (loading) {
    return <AdminLoadingState label="Checking access..." className="min-h-screen rounded-none border-0" />
  }

  if (!canAccessRoute) {
    return null
  }

  return <Outlet />
}
