import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const hasAdminAccess = Boolean(user) || import.meta.env.DEV || Boolean(import.meta.env.VITE_ADMIN_AUTH_TOKEN)

  useEffect(() => {
    if (!loading && !hasAdminAccess) {
      // Redirect to home page or login page if not authenticated
      navigate('/')
    }
  }, [loading, hasAdminAccess, navigate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!hasAdminAccess) {
    return null
  }

  return <Outlet />
}
