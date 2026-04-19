export type RegistrationErrorCode =
  | 'ROLE_NOT_FOUND'
  | 'DEPARTMENT_NOT_FOUND'
  | 'AUTH_FAILED'
  | 'PROFILE_WRITE_FAILED'

export class RegistrationError extends Error {
  readonly code: RegistrationErrorCode

  constructor(code: RegistrationErrorCode, message?: string) {
    super(message ?? code)
    this.name = 'RegistrationError'
    this.code = code
  }
}
