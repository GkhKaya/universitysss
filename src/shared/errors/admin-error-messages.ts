export const ADMIN_ERROR_CODES = {
  ADMIN_UNAUTHENTICATED: 'ADMIN_UNAUTHENTICATED',
  ADMIN_FORBIDDEN: 'ADMIN_FORBIDDEN',
  ADMIN_OPERATION_FAILED: 'ADMIN_OPERATION_FAILED',
  ADMIN_CANNOT_DELETE_SELF: 'ADMIN_CANNOT_DELETE_SELF',
  ADMIN_CATEGORY_NAME_REQUIRED: 'ADMIN_CATEGORY_NAME_REQUIRED',
  ADMIN_DEPARTMENT_NAME_REQUIRED: 'ADMIN_DEPARTMENT_NAME_REQUIRED',
} as const

export type AdminAppErrorCode = keyof typeof ADMIN_ERROR_CODES

export const ADMIN_ERROR_MESSAGES: Record<AdminAppErrorCode, string> = {
  ADMIN_UNAUTHENTICATED: 'Bu işlem için giriş yapmalısınız.',
  ADMIN_FORBIDDEN: 'Bu sayfaya yalnızca yöneticiler erişebilir.',
  ADMIN_OPERATION_FAILED: 'İşlem başarısız. Lütfen tekrar deneyin.',
  ADMIN_CANNOT_DELETE_SELF: 'Kendi hesabınızı silemezsiniz.',
  ADMIN_CATEGORY_NAME_REQUIRED: 'Kategori adı zorunludur.',
  ADMIN_DEPARTMENT_NAME_REQUIRED: 'Bölüm adı zorunludur.',
}

export function isAdminAppErrorCode(code: string): code is AdminAppErrorCode {
  return Object.prototype.hasOwnProperty.call(ADMIN_ERROR_CODES, code)
}
