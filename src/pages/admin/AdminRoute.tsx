import { Navigate } from 'react-router-dom'
import { useAuth, useIsPlatformAdmin } from '../../shared/auth'
import { AdminPage } from './AdminPage'

export function AdminRoute() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, checking } = useIsPlatformAdmin()

  if (authLoading || checking) {
    return <div className="adm-state" style={{ padding: '2rem' }}>Yükleniyor…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />
  }

  return <AdminPage />
}
