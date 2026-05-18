import { useEffect, useState } from 'react'
import { FIRESTORE_COLLECTIONS, type User as ProfileUser } from '../types/firestore'
import { firestoreManager } from '../lib/firebase'
import { useAuth } from './useAuth'
import { isPlatformAdmin } from './admin-role'

export function useIsPlatformAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!user) {
        if (!cancelled) {
          setIsAdmin(false)
          setChecking(false)
        }
        return
      }

      setChecking(true)
      try {
        const profile = await firestoreManager.getById<ProfileUser>(
          FIRESTORE_COLLECTIONS.users,
          user.uid,
        )
        if (!cancelled) {
          setIsAdmin(Boolean(profile && isPlatformAdmin(profile)))
          setChecking(false)
        }
      } catch {
        if (!cancelled) {
          setIsAdmin(false)
          setChecking(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user])

  return { isAdmin, checking }
}
