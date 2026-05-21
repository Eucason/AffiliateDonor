import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to home page or login page if not authenticated
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return <Outlet />
}