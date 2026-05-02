import type { LoginAppErrorCode } from './login-error-messages'
import type { QuestionAppErrorCode } from './question-error-messages'
import type { RegisterAppErrorCode } from './register-error-messages'

/** Tüm `AppError` kodları; yeni özellikler için burada birleştirilir. */
export type AppErrorCode = RegisterAppErrorCode | LoginAppErrorCode | QuestionAppErrorCode

/**
 * Uygulama genelinde taşınan hata: kod sabit, kullanıcı metni locale ile çözülür.
 */
export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, message?: string) {
    super(message ?? code)
    this.name = 'AppError'
    this.code = code
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError
}
