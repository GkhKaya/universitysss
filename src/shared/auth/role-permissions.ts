import type { User } from '../types/firestore'

function normalizeRole(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR')
}

export function canAccessQuestionApprovals(profile: Pick<User, 'roleId' | 'roleLabel'>): boolean {
  const roleLabel = normalizeRole(profile.roleLabel)
  const roleId = normalizeRole(profile.roleId)
  return (
    roleLabel.includes('öğretmen') ||
    roleLabel.includes('teacher') ||
    roleLabel.includes('admin') ||
    roleLabel.includes('yönetici') ||
    roleId.includes('teacher') ||
    roleId.includes('admin')
  )
}
