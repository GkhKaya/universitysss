import { createContext } from 'react'
import type { User } from 'firebase/auth'
import type { User as ProfileUser } from '../types/firestore'

export interface AuthContextValue {
  user: User | null
  profile: ProfileUser | null
  loading: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
})
