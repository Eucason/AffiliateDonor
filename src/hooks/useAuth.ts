import { useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'

// Re-export useAuth from context for convenience
export { useAuth } from '@/context/AuthContext'

// Additional auth hooks can be added here
export const useRequireAuth = () => {
  const { user, loading } = useContext(AuthContext)!
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
  }
}
