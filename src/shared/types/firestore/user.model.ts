import type { Timestamp } from 'firebase/firestore'
import type { UserPermissions, UserRoleAssignment } from './user-role-assignment.model'

/**
 * users — Kullanıcı profili (uid genelde document id ile aynıdır).
 */
export interface User {
  uid: string
  displayName: string
  email: string
  /** Kullanıcının tüm rolleri */
  roles: UserRoleAssignment[]
  /** Kurallar için denormalize rol kimlikleri */
  roleIds: string[]
  permissions?: UserPermissions
  departmentId: string
  departmentName: string
  /** false: admin onayı bekliyor (yoksa onaylı kabul edilir) */
  isApproved?: boolean
  createdAt: Timestamp
  /** @deprecated Tek rol — eski belgeler; okuma için */
  roleId?: string
  /** @deprecated Tek rol — eski belgeler; okuma için */
  roleLabel?: string
}
