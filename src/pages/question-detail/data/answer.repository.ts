import { serverTimestamp, where, arrayUnion } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { canAccessQuestionApprovals } from '../../../shared/auth/role-permissions'
import { getPrimaryRoleId } from '../../../shared/auth/user-roles'
import { AppError } from '../../../shared/errors'
import type { IAuthManager } from '../../../shared/lib/firebase'
import type { IFirestoreManager } from '../../../shared/lib/firebase'
import { FIRESTORE_COLLECTIONS } from '../../../shared/types/firestore'
import type { Answer, User } from '../../../shared/types/firestore'

export type CreateAnswerInput = {
  questionId: string
  parentId: string | null
  content: string
  isAnonymous: boolean
}

export class AnswerRepository {
  constructor(
    private readonly auth: IAuthManager,
    private readonly db: IFirestoreManager,
  ) {}

  async getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
    const results = await this.db.list<Answer>(
      FIRESTORE_COLLECTIONS.answers,
      where('questionId', '==', questionId),
    )

    const answers = results.map(({ id, data }) => ({
      id,
      questionId: data.questionId,
      parentId: data.parentId || null,
      content: data.content,
      authorId: data.authorId,
      authorName: data.authorName,
      authorRoleId: data.authorRoleId,
      isAnonymous: data.isAnonymous,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }))

    // İlk cevaplar üstte (Eskiden yeniye)
    return answers.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0
      const timeB = b.createdAt?.toMillis?.() || 0
      return timeA - timeB
    })
  }

  async createAnswer(input: CreateAnswerInput): Promise<string> {
    const user = this.auth.getCurrentUser()
    if (!user) throw new AppError('ANSWER_UNAUTHENTICATED')

    const profile = await this.db.getById<User>(FIRESTORE_COLLECTIONS.users, user.uid)
    if (!profile) throw new AppError('ANSWER_PROFILE_NOT_FOUND')

    const payload: DocumentData = {
      questionId: input.questionId,
      parentId: input.parentId,
      content: input.content.trim(),
      authorId: profile.uid,
      authorName: profile.displayName,
      authorRoleId: getPrimaryRoleId(profile),
      isAnonymous: input.isAnonymous,
      isVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    try {
      const answerId = await this.db.add(FIRESTORE_COLLECTIONS.answers, payload)
      
      // Soru dökümanını da güncelle ki answerIds dizisi senkronize kalsın
      await this.db.update(FIRESTORE_COLLECTIONS.questions, input.questionId, {
        answerIds: arrayUnion(answerId) as any,
        updatedAt: serverTimestamp(),
      })
      
      return answerId
    } catch (error) {
      console.error(error)
      throw new AppError('ANSWER_CREATE_FAILED')
    }
  }

  async closeQuestion(questionId: string): Promise<void> {
    const user = this.auth.getCurrentUser()
    if (!user) throw new AppError('QUESTION_UNAUTHENTICATED')

    const profile = await this.db.getById<User>(FIRESTORE_COLLECTIONS.users, user.uid)
    if (!profile) throw new AppError('PROFILE_NOT_FOUND')

    if (!canAccessQuestionApprovals(profile)) {
      throw new AppError('CLOSE_FORBIDDEN')
    }

    await this.db.update(FIRESTORE_COLLECTIONS.questions, questionId, {
      status: true,
      updatedAt: serverTimestamp(),
    })
  }
}
