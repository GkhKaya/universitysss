import { useCallback, useEffect, useState } from 'react'
import { isAppError, isQuestionAppErrorCode } from '../../../shared/errors'
import type { QuestionApprovalsMessages } from '../../../shared/locale/types'
import { questionRepository } from '../../ask/data/question.repository.instance'
import type { PendingApprovalQuestion } from '../../ask/data/question.repository'

type LoadStatus = 'loading' | 'ready' | 'error' | 'forbidden'

export function useQuestionApprovalsViewModel(messages: QuestionApprovalsMessages) {
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [questions, setQuestions] = useState<PendingApprovalQuestion[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setFeedback(null)
    try {
      const rows = await questionRepository.getPendingApprovalQuestions()
      setQuestions(rows)
      setStatus('ready')
    } catch (error) {
      if (isAppError(error) && isQuestionAppErrorCode(error.code)) {
        if (error.code === 'QUESTION_APPROVAL_FORBIDDEN') {
          setStatus('forbidden')
          return
        }
      }
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const approve = useCallback(
    async (questionId: string) => {
      setApprovingId(questionId)
      setFeedback(null)
      try {
        await questionRepository.approveQuestion(questionId)
        setQuestions((prev) => prev.filter((item) => item.id !== questionId))
        setFeedback(messages.successApproved)
      } catch (error) {
        if (isAppError(error) && isQuestionAppErrorCode(error.code)) {
          setFeedback(
            error.code === 'QUESTION_APPROVAL_FORBIDDEN'
              ? messages.accessDenied
              : messages.genericError,
          )
          return
        }
        setFeedback(messages.genericError)
      } finally {
        setApprovingId(null)
      }
    },
    [messages],
  )

  return {
    status,
    questions,
    feedback,
    approvingId,
    approve,
    reload: load,
  }
}
