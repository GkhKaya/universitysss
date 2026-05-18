import { PLATFORM_ADMIN_ROLE_ID } from '../config/platform-roles'
import type { User } from '../types/firestore'
import type { UserPermissions, UserRoleAssignment } from '../types/firestore/user-role-assignment.model'

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR')
}

/** Eski tek-rol belgeleri ile uyumlu rol listesi */
export function getUserRoles(profile: Pick<User, 'roles' | 'roleId' | 'roleLabel'>): UserRoleAssignment[] {
  if (profile.roles?.length) {
    return profile.roles
  }
  if (profile.roleId) {
    return [{ id: profile.roleId, label: profile.roleLabel ?? '' }]
  }
  return []
}

export function getUserRoleIds(profile: Pick<User, 'roles' | 'roleId' | 'roleIds'>): string[] {
  if (profile.roleIds?.length) {
    return profile.roleIds
  }
  return getUserRoles(profile).map((r) => r.id)
}

export function getPrimaryRoleId(profile: Pick<User, 'roles' | 'roleId'>): string {
  const roles = getUserRoles(profile)
  return roles[0]?.id ?? ''
}

export function formatUserRolesLabel(profile: Pick<User, 'roles' | 'roleId' | 'roleLabel'>): string {
  const roles = getUserRoles(profile)
  if (roles.length === 0) return '—'
  return roles.map((r) => r.label).join(', ')
}

function roleCanModerate(role: UserRoleAssignment): boolean {
  const roleId = normalize(role.id)
  const roleLabel = normalize(role.label)
  return (
    roleLabel.includes('öğretmen') ||
    roleLabel.includes('teacher') ||
    roleLabel.includes('admin') ||
    roleLabel.includes('yönetici') ||
    roleId.includes('teacher') ||
    roleId.includes('admin')
  )
}

export function computeUserPermissions(roles: UserRoleAssignment[]): UserPermissions {
  const isPlatformAdmin = roles.some((r) => r.id === PLATFORM_ADMIN_ROLE_ID)
  const canModerate = isPlatformAdmin || roles.some(roleCanModerate)
  return { canModerate, isPlatformAdmin }
}

/** Firestore users belgesine yazılacak rol alanları */
export function buildUserRoleFields(roles: UserRoleAssignment[]) {
  const permissions = computeUserPermissions(roles)
  return {
    roles,
    roleIds: roles.map((r) => r.id),
    permissions,
  }
}
