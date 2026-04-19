import type { RegisterMessages } from '../locale/types'

/**
 * Kayıt akışı hata kodları → locale anahtarı. Yeni kod eklerken burayı ve AppMessages’ı güncelleyin.
 */
export const REGISTER_MESSAGE_KEY = {
  REGISTER_REQUIRED_FIELDS: 'errorRequired',
  REGISTER_DEPARTMENT_REQUIRED: 'errorDepartmentRequired',
  REGISTER_EMAIL_STUDENT_DOMAIN: 'errorEmailStudentDomain',
  REGISTER_EMAIL_TEACHER_DOMAIN: 'errorEmailTeacherDomain',
  REGISTER_PASSWORD_LENGTH: 'errorPasswordLength',
  REGISTER_ROLE_NOT_FOUND: 'errorRoleNotFound',
  REGISTER_DEPARTMENT_NOT_FOUND: 'errorDepartmentNotFound',
  REGISTER_AUTH_FAILED: 'errorSignup',
  REGISTER_PROFILE_WRITE_FAILED: 'errorProfileWrite',
  REGISTER_SIGNUP_FAILED: 'errorSignup',
} as const satisfies Record<string, keyof RegisterMessages>

export type RegisterAppErrorCode = keyof typeof REGISTER_MESSAGE_KEY

export function resolveRegisterErrorMessage(
  code: RegisterAppErrorCode,
  messages: RegisterMessages,
): string {
  const key = REGISTER_MESSAGE_KEY[code]
  return messages[key]
}
