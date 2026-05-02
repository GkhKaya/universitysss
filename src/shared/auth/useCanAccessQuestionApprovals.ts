import { useEffect, useState } from 'react'
import { FIRESTORE_COLLECTIONS, type User as ProfileUser } from '../types/firestore'
import { firestoreManager } from '../lib/firebase'
import { useAuth } from './useAuth'
import { canAccessQuestionApprovals } from './role-permissions'

export function useCanAccessQuestionApprovals() {
  const { user } = useAuth()
  const [canAccess, setCanAccess] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!user) {
        if (!cancelled) {
          setCanAccess(false)
        }
        return
      }

      try {
        const profile = await firestoreManager.getById<ProfileUser>(FIRESTORE_COLLECTIONS.users, user.uid)
        if (!cancelled) {
          setCanAccess(Boolean(profile && canAccessQuestionApprovals(profile)))
        }
      } catch {
        if (!cancelled) {
          setCanAccess(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [user])

  return canAccess
}
