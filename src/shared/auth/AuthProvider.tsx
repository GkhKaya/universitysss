import { useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { authManager } from '../lib/firebase'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(authManager.getCurrentUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authManager.observeAuthState((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
