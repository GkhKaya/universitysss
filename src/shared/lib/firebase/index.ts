import { FirebaseAuthGateway } from './auth-gateway'
import { FirebaseAuthManager } from './auth-manager'
import { firebaseAuth, firebaseDb } from './client'
import { FirebaseFirestoreGateway } from './firestore-gateway'
import { FirebaseFirestoreManager } from './firestore-manager'

const authGateway = new FirebaseAuthGateway(firebaseAuth)
const firestoreGateway = new FirebaseFirestoreGateway(firebaseDb)

export const authManager = new FirebaseAuthManager(authGateway)
export const firestoreManager = new FirebaseFirestoreManager(firestoreGateway)

export * from './auth-gateway'
export * from './auth-manager'
export * from './firestore-gateway'
export * from './firestore-manager'
