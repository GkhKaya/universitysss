import type { Timestamp } from 'firebase/firestore'

export type QuestionTargetAudience = 'to_student' | 'to_teacher' | 'everyone'

/**
 * questions — Ana soru verisi; listeleme için denormalize alanlar içerir.
 */
export interface Question {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorRoleId: string
  /** İsim kartlarda/listede gizlenir */
  isAnonymous: boolean
  departmentId: string
  categoryId: string
  categoryName: string
  targetAudience: QuestionTargetAudience
  /** false: Bekliyor, true: Cevaplandı */
  status: boolean
  answerIds: string[]
  voteCount: number
  createdAt: Timestamp
  /** Düzenleme veya durum vb. güncellemelerde set edilir */
  updatedAt: Timestamp
}
