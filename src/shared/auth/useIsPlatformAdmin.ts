import { useAuth } from './useAuth'
import { isPlatformAdmin } from './admin-role'

export function useIsPlatformAdmin() {
  const { profile, loading } = useAuth()
  
  const isAdmin = Boolean(profile && isPlatformAdmin(profile))
  
  return { isAdmin, checking: loading }
}
