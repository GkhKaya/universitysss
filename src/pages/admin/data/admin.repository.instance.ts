import { authManager, firestoreManager } from '../../../shared/lib/firebase'
import { AdminRepository } from './admin.repository'

export const adminRepository = new AdminRepository(authManager, firestoreManager)
