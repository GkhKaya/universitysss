import type { IAuthManager } from '../../../../shared/lib/firebase/auth-manager'
import { AppError } from '../../../../shared/errors'

export class LoginRepository {
  private readonly auth: IAuthManager

  constructor(auth: IAuthManager) {
    this.auth = auth
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await this.auth.signIn(email.trim(), password)
    } catch {
      throw new AppError('LOGIN_INVALID_CREDENTIALS')
    }
  }
}
