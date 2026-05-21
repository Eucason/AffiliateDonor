import { useCallback, useEffect, useState } from 'react'
import { adminDashboardAPI } from '@/services/admin/adminDashboardAPI'
import type { AdminDashboardSnapshot } from '@/types/adminDashboard'

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const snapshot = await adminDashboardAPI.getSnapshot()
      setData(snapshot)
    } catch (requestError) {
      console.error('Failed to load admin dashboard:', requestError)
      setError('The admin dashboard could not be loaded. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  }
}
