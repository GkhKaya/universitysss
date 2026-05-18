import { authManager, firestoreManager } from '../../../shared/lib/firebase'
import { ProfileRepository } from './profile.repository'

export const profileRepository = new ProfileRepository(authManager, firestoreManager)
