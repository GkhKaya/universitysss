import { updateProfile as firebaseUpdateProfile } from 'firebase/auth'
import { AppError } from '../../../shared/errors'
import type { IAuthManager, IFirestoreManager } from '../../../shared/lib/firebase'
import { FIRESTORE_COLLECTIONS } from '../../../shared/types/firestore'
import type { Department, User } from '../../../shared/types/firestore'

export class ProfileRepository {
  constructor(
    private readonly auth: IAuthManager,
    private readonly db: IFirestoreManager,
  ) {}

  async getDepartments(): Promise<Array<{ id: string; data: Department }>> {
    return this.db.list<Department>(FIRESTORE_COLLECTIONS.departments)
  }

  async updateProfile(displayName: string, departmentId: string): Promise<void> {
    const user = this.auth.getCurrentUser()
    if (!user) {
      throw new AppError('PROFILE_UNAUTHENTICATED')
    }

    const dept = await this.db.getById<Department>(FIRESTORE_COLLECTIONS.departments, departmentId)
    if (!dept) {
      throw new AppError('PROFILE_DEPARTMENT_NOT_FOUND')
    }

    try {
      await firebaseUpdateProfile(user, { displayName: displayName.trim() })
    } catch {
      throw new AppError('PROFILE_AUTH_UPDATE_FAILED')
    }

    try {
      // Partial updates only send the modified fields
      await this.db.update<User>(FIRESTORE_COLLECTIONS.users, user.uid, {
        displayName: displayName.trim(),
        departmentId: dept.id,
        departmentName: dept.name,
      } as any)
    } catch {
      throw new AppError('PROFILE_FIRESTORE_UPDATE_FAILED')
    }
  }
}
