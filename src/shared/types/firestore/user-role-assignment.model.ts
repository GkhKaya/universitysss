/**
 * Kullanıcıya atanmış tek bir rol (userRoles koleksiyonundan).
 */
export type UserRoleAssignment = {
  id: string
  label: string
}

/**
 * Rollerden türetilen yetki bayrakları (Firestore kuralları + hızlı kontrol).
 */
export type UserPermissions = {
  canModerate: boolean
  isPlatformAdmin: boolean
}
