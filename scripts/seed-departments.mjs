/**
 * Toplu departments yazımı — Firebase Admin ile.
 *
 * 1. Service account: Firebase Console → Project settings → Service accounts → new private key
 * 2. Repoya anahtarı koyma; örn. ~/secrets/project-admin.json
 * 3. Kopyala: cp scripts/departments.seed.example.json scripts/departments.seed.json ve listeni doldur
 *
 * Çalıştırma:
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \\
 *   npm run seed:departments
 *
 * İsteğe bağlı — proje kimliği (JSON içindeki project_id kullanılmaz ise):
 *   FIREBASE_PROJECT_ID=your-project-id
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function loadDepartmentRows() {
  const seedPath = path.join(__dirname, 'departments.seed.json')
  const raw = readFileSync(seedPath, 'utf8')
  const rows = JSON.parse(raw)
  if (!Array.isArray(rows)) {
    throw new Error('departments.seed.json bir dizi (array) olmalıdır.')
  }
  return rows.map((row, index) => {
    if (
      typeof row !== 'object' ||
      row === null ||
      typeof row.id !== 'string' ||
      typeof row.name !== 'string'
    ) {
      throw new Error(`Geçersiz satır (${index}). Her kayıtta "id" ve "name" (string) gerekli.`)
    }
    const id = row.id.trim()
    const name = row.name.trim()
    if (!id || !name) {
      throw new Error(`Boş id veya name (${index}).`)
    }
    return { id, name }
  })
}

function getDb() {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
  if (!keyPath) {
    console.error(
      'GOOGLE_APPLICATION_CREDENTIALS tanımla (service account JSON dosya yolu).',
    )
    process.exit(1)
  }

  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'))
  const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
  if (!projectId) {
    console.error('project_id bulunamadı; FIREBASE_PROJECT_ID ile ver.')
    process.exit(1)
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    })
  }

  return getFirestore()
}

async function main() {
  const rows = loadDepartmentRows()
  const db = getDb()
  const collectionName = process.env.SEED_COLLECTION_NAME || 'departments'

  /** Firestore batch üst limiti 500; güvenlik payı için varsayılan 450 */
  const batchSize = Math.min(
    Math.max(1, Number(process.env.SEED_BATCH_SIZE || 450)),
    450,
  )

  let batch = db.batch()
  let ops = 0

  const commitBatch = async () => {
    if (ops === 0) return
    await batch.commit()
    batch = db.batch()
    ops = 0
  }

  for (const row of rows) {
    const docRef = db.collection(collectionName).doc(row.id)
    batch.set(docRef, { id: row.id, name: row.name }, { merge: true })
    ops += 1

    if (ops >= batchSize) {
      await commitBatch()
    }
  }

  await commitBatch()

  console.log(
    `[seed-departments] ${rows.length} kayıt "${collectionName}" koleksiyonuna yazıldı (merge).`,
  )
}

main().catch((err) => {
  console.error('[seed-departments] Hata:', err)
  process.exit(1)
})
