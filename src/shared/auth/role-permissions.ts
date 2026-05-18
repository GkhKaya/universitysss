import type { User } from '../types/firestore'
import { getUserRoles } from './user-roles'

function normalizeRole(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR')
}

function roleCanModerate(role: { id: string; label: string }): boolean {
  const roleLabel = normalizeRole(role.label)
  const roleId = normalizeRole(role.id)
  return (
    roleLabel.includes('öğretmen') ||
    roleLabel.includes('teacher') ||
    roleLabel.includes('admin') ||
    roleLabel.includes('yönetici') ||
    roleId.includes('teacher') ||
    roleId.includes('admin')
  )
}

export function canAccessQuestionApprovals(
  profile: Pick<User, 'roles' | 'roleId' | 'roleLabel' | 'permissions'>,
): boolean {
  if (profile.permissions?.canModerate) {
    return true
  }
  return getUserRoles(profile).some(roleCanModerate)
}
