import type { User, UserCredential } from 'firebase/auth'
import type { IAuthGateway } from './auth-gateway'

export interface IAuthManager {
  getCurrentUser(): User | null
  signUp(email: string, password: string): Promise<UserCredential>
  signIn(email: string, password: string): Promise<UserCredential>
  signOut(): Promise<void>
  observeAuthState(callback: (user: User | null) => void): () => void
}

export class FirebaseAuthManager implements IAuthManager {
  private readonly gateway: IAuthGateway

  constructor(gateway: IAuthGateway) {
    this.gateway = gateway
  }

  getCurrentUser(): User | null {
    return this.gateway.getCurrentUser()
  }

  signUp(email: string, password: string): Promise<UserCredential> {
    return this.gateway.signUp(email, password)
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return this.gateway.signIn(email, password)
  }

  signOut(): Promise<void> {
    return this.gateway.signOut()
  }

  observeAuthState(callback: (user: User | null) => void): () => void {
    return this.gateway.observeAuthState(callback)
  }
}
