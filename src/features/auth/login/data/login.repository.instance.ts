import { authManager } from '../../../../shared/lib/firebase'
import { LoginRepository } from './login.repository'

export const loginRepository = new LoginRepository(authManager)
