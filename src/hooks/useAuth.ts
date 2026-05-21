import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

// Re-export useAuth from context for convenience
export { useAuth } from '@/context/AuthContext'

// Additional auth hooks can be added here
export const useRequireAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useRequireAuth must be used within AuthProvider')
  }

  const { user, loading } = context
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
  }
}
