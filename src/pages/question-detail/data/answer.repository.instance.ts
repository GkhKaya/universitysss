import { authManager, firestoreManager } from '../../../shared/lib/firebase'
import { AnswerRepository } from './answer.repository'

export const answerRepository = new AnswerRepository(authManager, firestoreManager)
