import { serverTimestamp, where } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { AppError } from '../../../shared/errors'
import { canAccessQuestionApprovals } from '../../../shared/auth/role-permissions'
import type { IAuthManager } from '../../../shared/lib/firebase'
import type { IFirestoreManager } from '../../../shared/lib/firebase'
import { FIRESTORE_COLLECTIONS } from '../../../shared/types/firestore'
import type {
  Department,
  Question,
  QuestionCategory,
  QuestionTargetAudience,
  User,
} from '../../../shared/types/firestore'

type CreateQuestionInput = {
  title: string
  content: string
  categoryId: string
  departmentId: string
  isAnonymous: boolean
  targetAudience: QuestionTargetAudience
}

export type MyQuestion = {
  id: string
  title: string
  content: string
  categoryName: string
  isApproved: boolean
  status: boolean
  answerIds: string[]
  voteCount: number
  createdAt: Question['createdAt']
}

export type ApprovedQuestion = {
  id: string
  title: string
  content: string
  authorName: string
  categoryName: string
  answerIds: string[]
  voteCount: number
  createdAt: Question['createdAt']
}

export type PendingApprovalQuestion = {
  id: string
  title: string
  content: string
  authorName: string
  categoryName: string
  departmentId: string
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
      isApproved: data.isApproved,
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

    const [profile, category, department] = await Promise.all([
      this.db.getById<User>(FIRESTORE_COLLECTIONS.users, user.uid),
      this.db.getById<QuestionCategory>(FIRESTORE_COLLECTIONS.questionCategories, input.categoryId),
      this.db.getById<Department>(FIRESTORE_COLLECTIONS.departments, input.departmentId),
    ])

    if (!profile) {
      throw new AppError('QUESTION_PROFILE_NOT_FOUND')
    }
    if (!category) {
      throw new AppError('QUESTION_CATEGORY_NOT_FOUND')
    }
    if (!department) {
      throw new AppError('QUESTION_DEPARTMENT_NOT_FOUND')
    }

    const payload: DocumentData = {
      title: input.title.trim(),
      content: input.content.trim(),
      authorId: profile.uid,
      authorName: profile.displayName,
      authorRoleId: profile.roleId,
      isAnonymous: input.isAnonymous,
      departmentId: department.id,
      categoryId: input.categoryId,
      categoryName: category.name,
      targetAudience: input.targetAudience,
      isApproved: false,
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

  async getApprovedQuestions(): Promise<ApprovedQuestion[]> {
    const results = await this.db.list<Question>(
      FIRESTORE_COLLECTIONS.questions,
      where('isApproved', '==', true),
    )

    const questions = results.map(({ id, data }) => ({
      id,
      title: data.title,
      content: data.content,
      authorName: data.isAnonymous ? 'Anonim' : data.authorName,
      categoryName: data.categoryName,
      answerIds: data.answerIds,
      voteCount: data.voteCount,
      createdAt: data.createdAt,
    }))

    return questions.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0
      const timeB = b.createdAt?.toMillis?.() || 0
      return timeB - timeA
    })
  }

  async getPendingApprovalQuestions(): Promise<PendingApprovalQuestion[]> {
    const user = this.auth.getCurrentUser()
    if (!user) throw new AppError('QUESTION_UNAUTHENTICATED')

    const profile = await this.db.getById<User>(FIRESTORE_COLLECTIONS.users, user.uid)
    if (!profile || !canAccessQuestionApprovals(profile)) {
      throw new AppError('QUESTION_APPROVAL_FORBIDDEN')
    }

    const results = await this.db.list<Question>(
      FIRESTORE_COLLECTIONS.questions,
      where('isApproved', '==', false),
    )

    const questions = results.map(({ id, data }) => ({
      id,
      title: data.title,
      content: data.content,
      authorName: data.isAnonymous ? 'Anonim' : data.authorName,
      categoryName: data.categoryName,
      departmentId: data.departmentId,
      createdAt: data.createdAt,
    }))

    return questions.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0
      const timeB = b.createdAt?.toMillis?.() || 0
      return timeA - timeB
    })
  }

  async approveQuestion(questionId: string): Promise<void> {
    const user = this.auth.getCurrentUser()
    if (!user) throw new AppError('QUESTION_UNAUTHENTICATED')

    const profile = await this.db.getById<User>(FIRESTORE_COLLECTIONS.users, user.uid)
    if (!profile || !canAccessQuestionApprovals(profile)) {
      throw new AppError('QUESTION_APPROVAL_FORBIDDEN')
    }

    try {
      await this.db.update<Question>(FIRESTORE_COLLECTIONS.questions, questionId, {
        isApproved: true,
        updatedAt: serverTimestamp() as Question['updatedAt'],
      })
    } catch {
      throw new AppError('QUESTION_APPROVAL_UPDATE_FAILED')
    }
  }
}
