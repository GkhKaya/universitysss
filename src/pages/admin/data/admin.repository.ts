import { serverTimestamp, where } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { AppError } from '../../../shared/errors'
import { isPlatformAdmin } from '../../../shared/auth/admin-role'
import { buildUserRoleFields, formatUserRolesLabel, getUserRoles } from '../../../shared/auth/user-roles'
import type { IAuthManager, IFirestoreManager } from '../../../shared/lib/firebase'
import { FIRESTORE_COLLECTIONS } from '../../../shared/types/firestore'
import type {
  Answer,
  Department,
  Question,
  QuestionCategory,
  User,
  UserRole,
  UserRoleAssignment,
} from '../../../shared/types/firestore'

export type AdminQuestionRow = {
  id: string
  title: string
  content: string
  authorName: string
  categoryName: string
  isApproved: boolean
  createdAt: Question['createdAt']
}

export type AdminUserRow = {
  id: string
  displayName: string
  email: string
  rolesLabel: string
  roles: User['roles']
  departmentName: string
  isApproved: boolean
  createdAt: User['createdAt']
}

export type AdminCategoryRow = {
  id: string
  name: string
}

export type AdminDepartmentRow = {
  id: string
  name: string
}

export class AdminRepository {
  private readonly auth: IAuthManager
  private readonly db: IFirestoreManager

  constructor(auth: IAuthManager, db: IFirestoreManager) {
    this.auth = auth
    this.db = db
  }

  private async requireAdmin(): Promise<User> {
    const authUser = this.auth.getCurrentUser()
    if (!authUser) throw new AppError('ADMIN_UNAUTHENTICATED')

    let profile = await this.db.getById<User>(FIRESTORE_COLLECTIONS.users, authUser.uid)
    if (!profile) {
      throw new AppError('ADMIN_FORBIDDEN')
    }

    const roles = getUserRoles(profile)
    const needsRoleSync =
      roles.length > 0
      && (!profile.roleIds?.length || !profile.permissions)

    if (needsRoleSync) {
      const synced = buildUserRoleFields(roles)
      try {
        await this.db.update<User>(FIRESTORE_COLLECTIONS.users, authUser.uid, synced)
        profile = { ...profile, ...synced }
      } catch {
        // Kurallar izin vermezse mevcut profille devam et
      }
    }

    if (!isPlatformAdmin(profile)) {
      throw new AppError('ADMIN_FORBIDDEN')
    }
    return profile
  }

  async listPendingQuestions(): Promise<AdminQuestionRow[]> {
    await this.requireAdmin()
    const results = await this.db.list<Question>(
      FIRESTORE_COLLECTIONS.questions,
      where('isApproved', '==', false),
    )
    return results
      .map(({ id, data }) => ({
        id,
        title: data.title,
        content: data.content,
        authorName: data.isAnonymous ? 'Anonim' : data.authorName,
        categoryName: data.categoryName,
        isApproved: data.isApproved,
        createdAt: data.createdAt,
      }))
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
  }

  async listAllQuestions(): Promise<AdminQuestionRow[]> {
    await this.requireAdmin()
    const results = await this.db.list<Question>(FIRESTORE_COLLECTIONS.questions)
    return results
      .map(({ id, data }) => ({
        id,
        title: data.title,
        content: data.content,
        authorName: data.isAnonymous ? 'Anonim' : data.authorName,
        categoryName: data.categoryName,
        isApproved: data.isApproved,
        createdAt: data.createdAt,
      }))
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
  }

  async approveQuestion(questionId: string): Promise<void> {
    await this.requireAdmin()
    try {
      await this.db.update<Question>(FIRESTORE_COLLECTIONS.questions, questionId, {
        isApproved: true,
        updatedAt: serverTimestamp() as Question['updatedAt'],
      })
    } catch (err) {
      console.error('approveQuestion failed:', err)
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }

  async deleteQuestion(questionId: string): Promise<void> {
    await this.requireAdmin()
    try {
      const answers = await this.db.list<Answer>(
        FIRESTORE_COLLECTIONS.answers,
        where('questionId', '==', questionId),
      )
      await Promise.all(
        answers.map(({ id }) => this.db.remove(FIRESTORE_COLLECTIONS.answers, id)),
      )
      await this.db.remove(FIRESTORE_COLLECTIONS.questions, questionId)
    } catch {
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }

  async listUsers(): Promise<AdminUserRow[]> {
    await this.requireAdmin()
    const results = await this.db.list<User>(FIRESTORE_COLLECTIONS.users)
    return results
      .map(({ id, data }) => ({
        id,
        displayName: data.displayName,
        email: data.email,
        rolesLabel: formatUserRolesLabel(data),
        roles: getUserRoles(data),
        departmentName: data.departmentName,
        isApproved: data.isApproved !== false,
        createdAt: data.createdAt,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName, 'tr-TR'))
  }

  async approveUser(userId: string): Promise<void> {
    await this.requireAdmin()
    try {
      await this.db.update<User>(FIRESTORE_COLLECTIONS.users, userId, {
        isApproved: true,
      })
    } catch (err) {
      console.error('approveUser failed:', err)
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }

  async setUserRoles(userId: string, roles: User['roles']): Promise<void> {
    await this.requireAdmin()
    if (roles.length === 0) {
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
    try {
      await this.db.update<User>(FIRESTORE_COLLECTIONS.users, userId, buildUserRoleFields(roles))
    } catch {
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }

  async addUserRole(userId: string, role: UserRoleAssignment): Promise<void> {
    await this.requireAdmin()
    const existing = await this.db.getById<User>(FIRESTORE_COLLECTIONS.users, userId)
    if (!existing) throw new AppError('ADMIN_OPERATION_FAILED')
    const current = getUserRoles(existing)
    if (current.some((r) => r.id === role.id)) return
    await this.setUserRoles(userId, [...current, role])
  }

  async removeUserRole(userId: string, roleId: string): Promise<void> {
    await this.requireAdmin()
    const existing = await this.db.getById<User>(FIRESTORE_COLLECTIONS.users, userId)
    if (!existing) throw new AppError('ADMIN_OPERATION_FAILED')
    const next = getUserRoles(existing).filter((r) => r.id !== roleId)
    if (next.length === 0) throw new AppError('ADMIN_OPERATION_FAILED')
    await this.setUserRoles(userId, next)
  }

  async listAvailableRoles(): Promise<Array<{ id: string; label: string }>> {
    await this.requireAdmin()
    const results = await this.db.list<UserRole>(FIRESTORE_COLLECTIONS.userRoles)
    return results
      .map(({ id, data }) => ({ id, label: data.label }))
      .sort((a, b) => a.label.localeCompare(b.label, 'tr-TR'))
  }

  async deleteUser(userId: string): Promise<void> {
    const admin = await this.requireAdmin()
    if (userId === admin.uid) {
      throw new AppError('ADMIN_CANNOT_DELETE_SELF')
    }
    try {
      await this.db.remove(FIRESTORE_COLLECTIONS.users, userId)
    } catch {
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }

  async listCategories(): Promise<AdminCategoryRow[]> {
    await this.requireAdmin()
    const results = await this.db.list<QuestionCategory>(FIRESTORE_COLLECTIONS.questionCategories)
    return results
      .map(({ id, data }) => ({ id, name: data.name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'))
  }

  async addCategory(name: string): Promise<string> {
    await this.requireAdmin()
    const trimmed = name.trim()
    if (!trimmed) throw new AppError('ADMIN_CATEGORY_NAME_REQUIRED')
    try {
      const payload: DocumentData = { name: trimmed }
      return await this.db.add(FIRESTORE_COLLECTIONS.questionCategories, payload)
    } catch {
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.requireAdmin()
    try {
      await this.db.remove(FIRESTORE_COLLECTIONS.questionCategories, categoryId)
    } catch {
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }

  async listDepartments(): Promise<AdminDepartmentRow[]> {
    await this.requireAdmin()
    const results = await this.db.list<Department>(FIRESTORE_COLLECTIONS.departments)
    return results
      .map(({ id, data }) => ({ id, name: data.name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'))
  }

  async addDepartment(name: string): Promise<string> {
    await this.requireAdmin()
    const trimmed = name.trim()
    if (!trimmed) throw new AppError('ADMIN_DEPARTMENT_NAME_REQUIRED')
    try {
      const payload: DocumentData = { name: trimmed }
      return await this.db.add(FIRESTORE_COLLECTIONS.departments, payload)
    } catch {
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }

  async deleteDepartment(departmentId: string): Promise<void> {
    await this.requireAdmin()
    try {
      await this.db.remove(FIRESTORE_COLLECTIONS.departments, departmentId)
    } catch {
      throw new AppError('ADMIN_OPERATION_FAILED')
    }
  }
}
