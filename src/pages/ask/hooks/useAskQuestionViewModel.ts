import { useCallback, useEffect, useState } from 'react'
import {
  isAppError,
  isQuestionAppErrorCode,
  resolveQuestionErrorMessage,
} from '../../../shared/errors'
import { firestoreManager } from '../../../shared/lib/firebase'
import type { AskMessages } from '../../../shared/locale/types'
import { FIRESTORE_COLLECTIONS } from '../../../shared/types/firestore'
import type {
  Department,
  QuestionCategory,
  QuestionTargetAudience,
} from '../../../shared/types/firestore'
import { questionRepository } from '../data/question.repository.instance'

const TITLE_MAX_LENGTH = 120
const CONTENT_MIN_LENGTH = 20

export type AskFormStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; message: string }

export function useAskQuestionViewModel(messages: AskMessages) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [targetAudience, setTargetAudience] = useState<QuestionTargetAudience>('everyone')
  const [status, setStatus] = useState<AskFormStatus>({ kind: 'idle' })
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([])
  const [categoriesStatus, setCategoriesStatus] = useState<'loading' | 'error' | 'ready'>(
    'loading',
  )
  const [departmentsStatus, setDepartmentsStatus] = useState<'loading' | 'error' | 'ready'>(
    'loading',
  )

  useEffect(() => {
    let cancelled = false
    void firestoreManager
      .list<QuestionCategory>(FIRESTORE_COLLECTIONS.questionCategories)
      .then((rows) => {
        if (cancelled) {
          return
        }
        setCategories(
          rows.map((row) => ({
            id: row.id,
            name: row.data.name,
          })),
        )
        setCategoriesStatus('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setCategoriesStatus('error')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void firestoreManager
      .list<Department>(FIRESTORE_COLLECTIONS.departments)
      .then((rows) => {
        if (cancelled) return
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

  const resetFeedback = useCallback(() => {
    if (status.kind !== 'idle') {
      setStatus({ kind: 'idle' })
    }
  }, [status.kind])

  const submit = useCallback(async () => {
    resetFeedback()
    const normalizedTitle = title.trim()
    const normalizedContent = content.trim()

    if (!normalizedTitle || !normalizedContent) {
      setStatus({
        kind: 'error',
        message: resolveQuestionErrorMessage('QUESTION_REQUIRED_FIELDS', messages),
      })
      return
    }
    if (!departmentId) {
      setStatus({
        kind: 'error',
        message: resolveQuestionErrorMessage('QUESTION_DEPARTMENT_REQUIRED', messages),
      })
      return
    }
    if (!categoryId) {
      setStatus({
        kind: 'error',
        message: resolveQuestionErrorMessage('QUESTION_CATEGORY_REQUIRED', messages),
      })
      return
    }
    if (normalizedTitle.length > TITLE_MAX_LENGTH) {
      setStatus({
        kind: 'error',
        message: resolveQuestionErrorMessage('QUESTION_TITLE_TOO_LONG', messages),
      })
      return
    }
    if (normalizedContent.length < CONTENT_MIN_LENGTH) {
      setStatus({
        kind: 'error',
        message: resolveQuestionErrorMessage('QUESTION_CONTENT_TOO_SHORT', messages),
      })
      return
    }

    setStatus({ kind: 'submitting' })
    try {
      await questionRepository.createQuestion({
        title: normalizedTitle,
        content: normalizedContent,
        departmentId,
        categoryId,
        isAnonymous,
        targetAudience,
      })
      setTitle('')
      setContent('')
      setDepartmentId('')
      setCategoryId('')
      setIsAnonymous(false)
      setTargetAudience('everyone')
      setStatus({ kind: 'success', message: messages.successDescription })
    } catch (error) {
      if (isAppError(error) && isQuestionAppErrorCode(error.code)) {
        setStatus({
          kind: 'error',
          message: resolveQuestionErrorMessage(error.code, messages),
        })
        return
      }
      setStatus({
        kind: 'error',
        message: resolveQuestionErrorMessage('QUESTION_CREATE_FAILED', messages),
      })
    }
  }, [
    categoryId,
    content,
    departmentId,
    isAnonymous,
    messages,
    resetFeedback,
    targetAudience,
    title,
  ])

  return {
    title,
    setTitle,
    content,
    setContent,
    departmentId,
    setDepartmentId,
    categoryId,
    setCategoryId,
    isAnonymous,
    setIsAnonymous,
    targetAudience,
    setTargetAudience,
    categories,
    departments,
    categoriesStatus,
    departmentsStatus,
    status,
    submit,
    resetFeedback,
  }
}
