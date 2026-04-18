import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import type { Auth, User, UserCredential } from 'firebase/auth'

export interface IAuthGateway {
  getCurrentUser(): User | null
  signUp(email: string, password: string): Promise<UserCredential>
  signIn(email: string, password: string): Promise<UserCredential>
  signOut(): Promise<void>
  observeAuthState(callback: (user: User | null) => void): () => void
}

export class FirebaseAuthGateway implements IAuthGateway {
  private readonly auth: Auth

  constructor(auth: Auth) {
    this.auth = auth
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser
  }

  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  signOut(): Promise<void> {
    return signOut(this.auth)
  }

  observeAuthState(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback)
  }
}
