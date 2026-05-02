import { useEffect, useState } from 'react'
import { questionRepository } from '../../ask/data/question.repository.instance'
import type { MyQuestion } from '../../ask/data/question.repository'

type LoadStatus = 'loading' | 'ready' | 'error' | 'unauthenticated'

export function useMyQuestionsViewModel() {
  const [questions, setQuestions] = useState<MyQuestion[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setStatus('loading')
      try {
        const data = await questionRepository.getMyQuestions()
        if (!cancelled) {
          setQuestions(data)
          setStatus('ready')
        }
      } catch (err: unknown) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : ''
        if (message.includes('UNAUTHENTICATED') || message.includes('unauthenticated')) {
          setStatus('unauthenticated')
        } else {
          setStatus('error')
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return { questions, status }
}
