/**
 * userRoles — Sistemdeki statik rolleri ve yetkileri tanımlar.
 * Document id alanı ile aynı olmalıdır (örn. uuid-role-student).
 */
export interface UserRole {
  id: string
  label: string
  permissions: string[]
}
