import { authManager, firestoreManager } from '../../../../shared/lib/firebase'
import { RegisterRepository } from './register.repository'

export const registerRepository = new RegisterRepository(authManager, firestoreManager)
