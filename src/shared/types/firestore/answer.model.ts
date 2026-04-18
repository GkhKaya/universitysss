import type { Timestamp } from 'firebase/firestore'

/**
 * answers — Soru cevapları.
 */
export interface Answer {
  id: string
  questionId: string
  content: string
  authorId: string
  authorName: string
  authorRoleId: string
  /** Hoca veya admin onayı */
  isVerified: boolean
  createdAt: Timestamp
}
