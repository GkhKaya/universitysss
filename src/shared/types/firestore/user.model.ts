import type { Timestamp } from 'firebase/firestore'

/**
 * users — Kullanıcı profili (uid genelde document id ile aynıdır).
 */
export interface User {
  uid: string
  displayName: string
  email: string
  roleId: string
  roleLabel: string
  departmentId: string
  departmentName: string
  createdAt: Timestamp
}
