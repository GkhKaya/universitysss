import { orderBy, serverTimestamp, where } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { AppError } from '../../../shared/errors'
import type { IAuthManager } from '../../../shared/lib/firebase'
import type { IFirestoreManager } from '../../../shared/lib/firebase'
import { FIRESTORE_COLLECTIONS } from '../../../shared/types/firestore'
import type {
  Question,
  QuestionCategory,
  QuestionTargetAudience,
  User,
} from '../../../shared/types/firestore'

type CreateQuestionInput = {
  title: string
  content: string
  categoryId: string
  isAnonymous: boolean
  targetAudience: QuestionTargetAudience
}

export type MyQuestion = {
  id: string
  title: string
  content: string
  categoryName: string
  status: boolean
  answerIds: string[]
  voteCount: number
  createdAt: Question['createdAt']
}

export class QuestionRepository {
  private readonly auth: IAuthManager
  private readonly db: IFirestoreManager

  constructor(auth: IAuthManager, db: IFirestoreManager) {
    this.auth = auth
    this.db = db
  }

  async getMyQuestions(): Promise<MyQuestion[]> {
    const user = this.auth.getCurrentUser()
    if (!user) throw new AppError('QUESTION_UNAUTHENTICATED')

    const results = await this.db.list<Question>(
      FIRESTORE_COLLECTIONS.questions,
      where('authorId', '==', user.uid),
    )

    const questions = results.map(({ id, data }) => ({
      id,
      title: data.title,
      content: data.content,
      categoryName: data.categoryName,
      status: data.status,
      answerIds: data.answerIds,
      voteCount: data.voteCount,
      createdAt: data.createdAt,
    }))

    // Firebase Composite Index hatasını önlemek için sıralamayı client tarafında yapıyoruz.
    return questions.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0
      const timeB = b.createdAt?.toMillis?.() || 0
      return timeB - timeA
    })
  }

  async createQuestion(input: CreateQuestionInput): Promise<string> {
    const user = this.auth.getCurrentUser()
    if (!user) {
      throw new AppError('QUESTION_UNAUTHENTICATED')
    }

    const [profile, category] = await Promise.all([
      this.db.getById<User>(FIRESTORE_COLLECTIONS.users, user.uid),
      this.db.getById<QuestionCategory>(FIRESTORE_COLLECTIONS.questionCategories, input.categoryId),
    ])

    if (!profile) {
      throw new AppError('QUESTION_PROFILE_NOT_FOUND')
    }
    if (!category) {
      throw new AppError('QUESTION_CATEGORY_NOT_FOUND')
    }

    const payload: DocumentData = {
      title: input.title.trim(),
      content: input.content.trim(),
      authorId: profile.uid,
      authorName: profile.displayName,
      authorRoleId: profile.roleId,
      isAnonymous: input.isAnonymous,
      departmentId: profile.departmentId,
      categoryId: input.categoryId,
      categoryName: category.name,
      targetAudience: input.targetAudience,
      status: false,
      answerIds: [],
      voteCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    try {
      return await this.db.add(FIRESTORE_COLLECTIONS.questions, payload)
    } catch {
      throw new AppError('QUESTION_CREATE_FAILED')
    }
  }
}
