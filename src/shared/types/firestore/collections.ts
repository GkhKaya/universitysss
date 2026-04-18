export const FIRESTORE_COLLECTIONS = {
  userRoles: 'userRoles',
  departments: 'departments',
  users: 'users',
  questionCategories: 'questionCategories',
  questions: 'questions',
  answers: 'answers',
} as const

export type FirestoreCollectionName =
  (typeof FIRESTORE_COLLECTIONS)[keyof typeof FIRESTORE_COLLECTIONS]
