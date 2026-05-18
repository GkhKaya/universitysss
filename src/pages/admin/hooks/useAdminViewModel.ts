import { useCallback, useEffect, useState } from 'react'
import { isAppError } from '../../../shared/errors'
import { ADMIN_ERROR_MESSAGES, isAdminAppErrorCode } from '../../../shared/errors/admin-error-messages'
import { formatUserRolesLabel } from '../../../shared/auth/user-roles'
import type {
  AdminCategoryRow,
  AdminDepartmentRow,
  AdminQuestionRow,
  AdminUserRow,
} from '../data/admin.repository'
import { adminRepository } from '../data/admin.repository.instance'

export type AdminTab = 'questions' | 'users' | 'categories' | 'departments'

type LoadStatus = 'loading' | 'ready' | 'forbidden' | 'error'

function resolveError(err: unknown): string {
  if (isAppError(err) && isAdminAppErrorCode(err.code)) {
    return ADMIN_ERROR_MESSAGES[err.code]
  }
  return ADMIN_ERROR_MESSAGES.ADMIN_OPERATION_FAILED
}

export function useAdminViewModel() {
  const [tab, setTab] = useState<AdminTab>('questions')
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [pendingQuestions, setPendingQuestions] = useState<AdminQuestionRow[]>([])
  const [allQuestions, setAllQuestions] = useState<AdminQuestionRow[]>([])
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [categories, setCategories] = useState<AdminCategoryRow[]>([])
  const [departments, setDepartments] = useState<AdminDepartmentRow[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newDepartmentName, setNewDepartmentName] = useState('')
  const [questionFilter, setQuestionFilter] = useState<'pending' | 'open' | 'closed' | 'all'>('all')
  const [availableRoles, setAvailableRoles] = useState<Array<{ id: string; label: string }>>([])
  const [roleToAddByUser, setRoleToAddByUser] = useState<Record<string, string>>({})

  const applyData = useCallback(
    (data: {
      pending: AdminQuestionRow[]
      all: AdminQuestionRow[]
      userRows: AdminUserRow[]
      categoryRows: AdminCategoryRow[]
      departmentRows: AdminDepartmentRow[]
      roles: Array<{ id: string; label: string }>
    }) => {
      setPendingQuestions(data.pending)
      setAllQuestions(data.all)
      setUsers(data.userRows)
      setCategories(data.categoryRows)
      setDepartments(data.departmentRows)
      setAvailableRoles(data.roles)
    },
    [],
  )

  const fetchAll = useCallback(async () => {
    const [pending, all, userRows, categoryRows, departmentRows, roles] = await Promise.all([
      adminRepository.listPendingQuestions(),
      adminRepository.listAllQuestions(),
      adminRepository.listUsers(),
      adminRepository.listCategories(),
      adminRepository.listDepartments(),
      adminRepository.listAvailableRoles(),
    ])
    applyData({ pending, all, userRows, categoryRows, departmentRows, roles })
  }, [applyData])

  const load = useCallback(async () => {
    setStatus('loading')
    setFeedback(null)
    try {
      await fetchAll()
      setStatus('ready')
    } catch (err) {
      if (isAppError(err) && err.code === 'ADMIN_FORBIDDEN') {
        setStatus('forbidden')
        return
      }
      setStatus('error')
      setFeedback(resolveError(err))
    }
  }, [fetchAll])

  useEffect(() => {
    void load()
  }, [load])

  const runAction = async (
    id: string,
    action: () => Promise<void>,
    successMessage: string,
    onSuccess?: () => void,
  ) => {
    setBusyId(id)
    try {
      await action()
      onSuccess?.()
      setFeedback(successMessage)
    } catch (err) {
      setFeedback(resolveError(err))
    } finally {
      setBusyId(null)
    }
  }

  const removeQuestionFromState = (questionId: string) => {
    setPendingQuestions((prev) => prev.filter((q) => q.id !== questionId))
    setAllQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  const markQuestionApproved = (questionId: string) => {
    setPendingQuestions((prev) => prev.filter((q) => q.id !== questionId))
    setAllQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, isApproved: true } : q)),
    )
  }

  const approveQuestion = (questionId: string) =>
    runAction(
      questionId,
      () => adminRepository.approveQuestion(questionId),
      'Soru onaylandı.',
      () => markQuestionApproved(questionId),
    )

  const markQuestionClosed = (questionId: string) => {
    setAllQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, status: true } : q)),
    )
  }

  const closeQuestion = (questionId: string) =>
    runAction(
      questionId,
      () => adminRepository.closeQuestion(questionId),
      'Soru kapatıldı.',
      () => markQuestionClosed(questionId),
    )

  const deleteQuestion = (questionId: string) => {
    if (!confirm('Bu soru ve tüm cevapları silinecek. Emin misiniz?')) return
    void runAction(
      questionId,
      () => adminRepository.deleteQuestion(questionId),
      'Soru silindi.',
      () => removeQuestionFromState(questionId),
    )
  }

  const approveUser = (userId: string) =>
    runAction(
      userId,
      () => adminRepository.approveUser(userId),
      'Kullanıcı onaylandı.',
      () => {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isApproved: true } : u)),
        )
      },
    )

  const deleteUser = (userId: string) => {
    if (!confirm('Kullanıcı profili silinecek (Firebase Auth hesabı ayrı kalır). Emin misiniz?')) return
    void runAction(
      userId,
      () => adminRepository.deleteUser(userId),
      'Kullanıcı silindi.',
      () => setUsers((prev) => prev.filter((u) => u.id !== userId)),
    )
  }

  const addCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) {
      setFeedback(ADMIN_ERROR_MESSAGES.ADMIN_CATEGORY_NAME_REQUIRED)
      return
    }
    setBusyId('new-category')
    try {
      const id = await adminRepository.addCategory(name)
      setCategories((prev) =>
        [...prev, { id, name }].sort((a, b) => a.name.localeCompare(b.name, 'tr-TR')),
      )
      setNewCategoryName('')
      setFeedback('Kategori eklendi.')
    } catch (err) {
      setFeedback(resolveError(err))
    } finally {
      setBusyId(null)
    }
  }

  const deleteCategory = (categoryId: string) => {
    if (!confirm('Bu kategori silinecek. Emin misiniz?')) return
    void runAction(
      categoryId,
      () => adminRepository.deleteCategory(categoryId),
      'Kategori silindi.',
      () => setCategories((prev) => prev.filter((c) => c.id !== categoryId)),
    )
  }

  const addDepartment = async () => {
    const name = newDepartmentName.trim()
    if (!name) {
      setFeedback(ADMIN_ERROR_MESSAGES.ADMIN_DEPARTMENT_NAME_REQUIRED)
      return
    }
    setBusyId('new-department')
    try {
      const id = await adminRepository.addDepartment(name)
      setDepartments((prev) =>
        [...prev, { id, name }].sort((a, b) => a.name.localeCompare(b.name, 'tr-TR')),
      )
      setNewDepartmentName('')
      setFeedback('Bölüm eklendi.')
    } catch (err) {
      setFeedback(resolveError(err))
    } finally {
      setBusyId(null)
    }
  }

  const deleteDepartment = (departmentId: string) => {
    if (!confirm('Bu bölüm silinecek. Emin misiniz?')) return
    void runAction(
      departmentId,
      () => adminRepository.deleteDepartment(departmentId),
      'Bölüm silindi.',
      () => setDepartments((prev) => prev.filter((d) => d.id !== departmentId)),
    )
  }

  const addUserRole = (userId: string) => {
    const roleId = roleToAddByUser[userId]
    const role = availableRoles.find((r) => r.id === roleId)
    if (!role) return
    void runAction(
      `${userId}-add-${roleId}`,
      () => adminRepository.addUserRole(userId, role),
      'Rol eklendi.',
      () => {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id !== userId) return u
            const roles = [...u.roles, role]
            return {
              ...u,
              roles,
              rolesLabel: formatUserRolesLabel({ roles, roleId: '', roleLabel: '' }),
            }
          }),
        )
        setRoleToAddByUser((prev) => ({ ...prev, [userId]: '' }))
      },
    )
  }

  const removeUserRole = (userId: string, roleId: string) => {
    void runAction(
      `${userId}-rm-${roleId}`,
      () => adminRepository.removeUserRole(userId, roleId),
      'Rol kaldırıldı.',
      () => {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id !== userId) return u
            const roles = u.roles.filter((r) => r.id !== roleId)
            return {
              ...u,
              roles,
              rolesLabel: formatUserRolesLabel({ roles, roleId: '', roleLabel: '' }),
            }
          }),
        )
      },
    )
  }

  const setRoleToAdd = (userId: string, roleId: string) => {
    setRoleToAddByUser((prev) => ({ ...prev, [userId]: roleId }))
  }

  const pendingUsers = users.filter((u) => !u.isApproved)
  const questionList = (() => {
    if (questionFilter === 'pending') return pendingQuestions
    if (questionFilter === 'all') return allQuestions
    if (questionFilter === 'open') return allQuestions.filter((q) => q.isApproved && !q.status)
    if (questionFilter === 'closed') return allQuestions.filter((q) => q.status)
    return pendingQuestions
  })()

  return {
    tab,
    setTab,
    status,
    feedback,
    busyId,
    questionList,
    questionFilter,
    setQuestionFilter,
    pendingQuestions,
    allQuestions,
    users,
    pendingUsers,
    categories,
    departments,
    newCategoryName,
    setNewCategoryName,
    newDepartmentName,
    setNewDepartmentName,
    approveQuestion,
    closeQuestion,
    deleteQuestion,
    approveUser,
    deleteUser,
    addCategory,
    deleteCategory,
    addDepartment,
    deleteDepartment,
    availableRoles,
    roleToAddByUser,
    setRoleToAdd,
    addUserRole,
    removeUserRole,
    reload: load,
  }
}
