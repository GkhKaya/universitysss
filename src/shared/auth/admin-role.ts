import { PLATFORM_ADMIN_ROLE_ID } from '../config/platform-roles'
import { getUserRoleIds } from './user-roles'
import type { User } from '../types/firestore'

export { PLATFORM_ADMIN_ROLE_ID }

type AdminProfile = Pick<User, 'roles' | 'roleIds' | 'roleId' | 'permissions'>

/** Kullanıcının rolleri arasında platform admin rolü var mı? */
export function isPlatformAdmin(profile: AdminProfile): boolean {
  if (profile.permissions?.isPlatformAdmin) {
    return true
  }
  return getUserRoleIds(profile).includes(PLATFORM_ADMIN_ROLE_ID)
}

/** Yeni kayıtlar admin onayı bekler; platform admin rolü varsa otomatik onaylı */
export function defaultUserIsApproved(roles: { id: string }[]): boolean {
  return roles.some((r) => r.id === PLATFORM_ADMIN_ROLE_ID)
}
