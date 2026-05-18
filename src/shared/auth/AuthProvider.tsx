import { useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { authManager, firestoreManager } from '../lib/firebase'
import { AuthContext } from './AuthContext'
import { FIRESTORE_COLLECTIONS, type User as ProfileUser } from '../types/firestore'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(authManager.getCurrentUser())
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authManager.observeAuthState(async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        try {
          const p = await firestoreManager.getById<ProfileUser>(FIRESTORE_COLLECTIONS.users, currentUser.uid)
          setProfile(p)
        } catch {
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await authManager.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
