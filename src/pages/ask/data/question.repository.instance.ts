import { authManager, firestoreManager } from '../../../shared/lib/firebase'
import { QuestionRepository } from './question.repository'

export const questionRepository = new QuestionRepository(authManager, firestoreManager)
