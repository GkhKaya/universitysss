import type { RegisterAppErrorCode } from './register-error-messages'

/** Tüm `AppError` kodları; yeni özellikler için burada birleştirilir. */
export type AppErrorCode = RegisterAppErrorCode

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
