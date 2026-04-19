/**
 * Kayıt akışı: Auth + Firestore users belgesi.
 * UI katmanı burayı doğrudan çağırmaz; ViewModel (useRegisterViewModel) orkestre eder.
 */
import { updateProfile } from 'firebase/auth'
import { serverTimestamp } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import type { IAuthManager } from '../../../shared/lib/firebase/auth-manager'
import type { IFirestoreManager } from '../../../shared/lib/firebase/firestore-manager'
import { FIRESTORE_COLLECTIONS } from '../../../shared/types/firestore'
import type { Department } from '../../../shared/types/firestore/department.model'
import type { UserRole } from '../../../shared/types/firestore/user-role.model'
import type { RegistrationRole } from '../model/types'
import { RegistrationError } from './registration.errors'

export type CompleteRegistrationInput = {
  displayName: string
  email: string
  password: string
  role: RegistrationRole
  /** Firestore departments belgesi — listeden seçim */
  department: { id: string; name: string }
  /** Seçilen rolün etiketi ile Firestore userRoles kaydı eşleştirilir */
  roleLabels: Record<RegistrationRole, string>
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR')
}

function roleLabelCandidates(
  role: RegistrationRole,
  roleLabels: Record<RegistrationRole, string>,
): Set<string> {
  const primary = normalize(roleLabels[role])
  const extras =
    role === 'student'
      ? ['öğrenci', 'student', 'undergraduate']
      : ['öğretmen', 'teacher', 'faculty', 'instructor', 'professor']
  return new Set([primary, ...extras.map((s) => normalize(s))].filter(Boolean))
}

function findRole(
  roles: Array<{ id: string; data: UserRole }>,
  role: RegistrationRole,
  roleLabels: Record<RegistrationRole, string>,
): { id: string; label: string } | null {
  const candidates = roleLabelCandidates(role, roleLabels)
  for (const row of roles) {
    const label = normalize(row.data.label)
    if (candidates.has(label)) {
      return { id: row.id, label: row.data.label }
    }
  }
  return null
}

export class RegisterRepository {
  private readonly auth: IAuthManager
  private readonly db: IFirestoreManager

  constructor(auth: IAuthManager, db: IFirestoreManager) {
    this.auth = auth
    this.db = db
  }

  async completeRegistration(input: CompleteRegistrationInput): Promise<void> {
    const [roles, departments] = await Promise.all([
      this.db.list<UserRole>(FIRESTORE_COLLECTIONS.userRoles),
      this.db.list<Department>(FIRESTORE_COLLECTIONS.departments),
    ])

    const resolvedRole = findRole(roles, input.role, input.roleLabels)
    if (!resolvedRole) {
      throw new RegistrationError('ROLE_NOT_FOUND')
    }

    const deptRow = departments.find((row) => row.id === input.department.id)
    if (!deptRow) {
      throw new RegistrationError('DEPARTMENT_NOT_FOUND')
    }
    const resolvedDept = { id: deptRow.id, name: deptRow.data.name }

    let uid: string
    try {
      const credential = await this.auth.signUp(input.email.trim(), input.password)
      uid = credential.user.uid
      await updateProfile(credential.user, { displayName: input.displayName.trim() })
    } catch {
      throw new RegistrationError('AUTH_FAILED')
    }

    const userDoc: DocumentData = {
      uid,
      displayName: input.displayName.trim(),
      email: input.email.trim(),
      roleId: resolvedRole.id,
      roleLabel: resolvedRole.label,
      departmentId: resolvedDept.id,
      departmentName: resolvedDept.name,
      createdAt: serverTimestamp(),
    }

    try {
      await this.db.set(FIRESTORE_COLLECTIONS.users, uid, userDoc)
    } catch {
      throw new RegistrationError('PROFILE_WRITE_FAILED')
    }
  }
}
