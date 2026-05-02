import type { Timestamp } from 'firebase/firestore'

/**
 * answers — Soru cevapları.
 */
export interface Answer {
  id?: string // Firestore'dan çekerken ekliyoruz genelde
  questionId: string
  parentId: string | null // Zincirleme cevap için (ana cevap ise null)
  content: string
  authorId: string
  authorName: string
  authorRoleId: string
  isAnonymous: boolean
  /** Hoca veya admin onayı */
  isVerified: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
