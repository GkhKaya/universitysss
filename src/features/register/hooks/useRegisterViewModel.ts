/**
 * ViewModel rolü: UI state + doğrulama + repository çağrısı.
 * SwiftUI’deki ObservableObject / @Published benzeri: burada useState + türetilmiş status.
 * Swift `switch state` kalıbının React karşılığı: (a) bu dosyadaki discriminated union `status`,
 * veya (b) daha ağır akışlarda `useReducer` + action enum.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { firestoreManager } from '../../../shared/lib/firebase'
import type { RegisterMessages } from '../../../shared/locale/types'
import { FIRESTORE_COLLECTIONS } from '../../../shared/types/firestore'
import type { Department } from '../../../shared/types/firestore/department.model'
import { registerRepository } from '../data/register.repository.instance'
import { RegistrationError, type RegistrationErrorCode } from '../data/registration.errors'
import type { DepartmentOption, RegistrationRole } from '../model/types'
import { isValidDpuStudentEmail, isValidDpuTeacherEmail } from '../utils/dpuEmailPolicy'
import { normalizeSearch } from '../utils/search'

export type RegisterFormStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; message: string }

export function useRegisterViewModel(messages: RegisterMessages) {
  const [role, setRole] = useState<RegistrationRole>('student')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<RegisterFormStatus>({ kind: 'idle' })

  const [departments, setDepartments] = useState<DepartmentOption[]>([])
  const [departmentsStatus, setDepartmentsStatus] = useState<'loading' | 'error' | 'ready'>(
    'loading',
  )
  const [departmentSearch, setDepartmentSearch] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null)

  useEffect(() => {
    let cancelled = false
    void firestoreManager
      .list<Department>(FIRESTORE_COLLECTIONS.departments)
      .then((rows) => {
        if (cancelled) {
          return
        }
        setDepartments(
          rows.map((row) => ({
            id: row.id,
            name: row.data.name,
          })),
        )
        setDepartmentsStatus('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setDepartmentsStatus('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filteredDepartments = useMemo(() => {
    if (departments.length === 0) {
      return []
    }
    const q = normalizeSearch(departmentSearch)
    if (!q) {
      return departments
    }
    return departments.filter((d) => normalizeSearch(d.name).includes(q))
  }, [departments, departmentSearch])

  const handleDepartmentSearchChange = useCallback(
    (value: string) => {
      setDepartmentSearch(value)
      setSelectedDepartment((prev) => {
        if (!prev) {
          return null
        }
        if (normalizeSearch(value) === normalizeSearch(prev.name)) {
          return prev
        }
        return null
      })
    },
    [],
  )

  const handleDepartmentSelect = useCallback((dept: DepartmentOption) => {
    setSelectedDepartment(dept)
    setDepartmentSearch(dept.name)
  }, [])

  const resetFeedback = useCallback(() => {
    setStatus({ kind: 'idle' })
  }, [])

  const submit = useCallback(async () => {
    resetFeedback()
    const name = displayName.trim()
    const mail = email.trim()
    const pass = password

    if (!name || !mail || !pass) {
      setStatus({ kind: 'error', message: messages.errorRequired })
      return
    }
    if (!selectedDepartment) {
      setStatus({ kind: 'error', message: messages.errorDepartmentRequired })
      return
    }
    if (role === 'student' && !isValidDpuStudentEmail(mail)) {
      setStatus({ kind: 'error', message: messages.errorEmailStudentDomain })
      return
    }
    if (role === 'teacher' && !isValidDpuTeacherEmail(mail)) {
      setStatus({ kind: 'error', message: messages.errorEmailTeacherDomain })
      return
    }
    if (pass.length < 6) {
      setStatus({ kind: 'error', message: messages.errorPasswordLength })
      return
    }

    setStatus({ kind: 'submitting' })
    try {
      await registerRepository.completeRegistration({
        displayName: name,
        email: mail,
        password: pass,
        role,
        department: selectedDepartment,
        roleLabels: {
          student: messages.roleStudent,
          teacher: messages.roleTeacher,
        },
      })
      setStatus({ kind: 'success', message: messages.successSignup })
    } catch (err) {
      if (err instanceof RegistrationError) {
        const map: Record<RegistrationErrorCode, string> = {
          ROLE_NOT_FOUND: messages.errorRoleNotFound,
          DEPARTMENT_NOT_FOUND: messages.errorDepartmentNotFound,
          AUTH_FAILED: messages.errorSignup,
          PROFILE_WRITE_FAILED: messages.errorProfileWrite,
        }
        setStatus({ kind: 'error', message: map[err.code] })
        return
      }
      setStatus({ kind: 'error', message: messages.errorSignup })
    }
  }, [
    displayName,
    email,
    messages,
    password,
    resetFeedback,
    role,
    selectedDepartment,
  ])

  return {
    role,
    setRole,
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    departments,
    departmentsStatus,
    departmentSearch,
    setDepartmentSearch: handleDepartmentSearchChange,
    filteredDepartments,
    selectedDepartment,
    setSelectedDepartment: handleDepartmentSelect,
    status,
    submit,
    resetFeedback,
  }
}
