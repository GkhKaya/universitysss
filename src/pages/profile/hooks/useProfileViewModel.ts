import { useState, useEffect } from 'react'
import { useAuth } from '../../../shared/auth'
import { profileRepository } from '../data/profile.repository.instance'
import { questionRepository } from '../../ask/data/question.repository.instance'
import { answerRepository } from '../../question-detail/data/answer.repository.instance'
import type { Department, Question } from '../../../shared/types/firestore'

export function useProfileViewModel() {
  const { user, profile } = useAuth()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unauthenticated'>('loading')
  const [departments, setDepartments] = useState<Array<{ id: string; data: Department }>>([])
  const [askedQuestions, setAskedQuestions] = useState<any[]>([])
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!user || !profile) {
        if (!cancelled) setStatus('unauthenticated')
        return
      }

      setStatus('loading')
      try {
        const [depts, asked, answered] = await Promise.all([
          profileRepository.getDepartments(),
          questionRepository.getMyQuestions(),
          answerRepository.getMyAnsweredQuestions(),
        ])
        
        if (!cancelled) {
          setDepartments(depts)
          setAskedQuestions(asked)
          setAnsweredQuestions(answered)
          setStatus('ready')
        }
      } catch (err) {
        if (!cancelled) setStatus('error')
      }
    }
    
    void load()
    return () => { cancelled = true }
  }, [user, profile])

  const updateProfile = async (displayName: string, departmentId: string) => {
    setIsUpdating(true)
    setUpdateError('')
    setUpdateSuccess('')
    try {
      await profileRepository.updateProfile(displayName, departmentId)
      setUpdateSuccess('Profiliniz başarıyla güncellendi.')
      // A full page reload ensures AuthContext re-fetches the updated document.
      window.location.reload()
    } catch (err: any) {
      setUpdateError(err?.message || 'Bir hata oluştu')
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    profile,
    status,
    departments,
    askedQuestions,
    answeredQuestions,
    isUpdating,
    updateError,
    updateSuccess,
    updateProfile
  }
}
