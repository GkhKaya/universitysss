import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { firebaseEnv } from '../../config/env'

const firebaseApp = initializeApp(firebaseEnv)

export const firebaseAuth = getAuth(firebaseApp)

// Safari / bazı ağlarda WebChannel yerine long-polling gerekir (Listen/channel CORS uyarıları).
export const firebaseDb = initializeFirestore(firebaseApp, {
  experimentalAutoDetectLongPolling: true,
})
