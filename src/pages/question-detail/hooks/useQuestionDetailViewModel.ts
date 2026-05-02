import { useEffect, useState, useCallback } from 'react'
import { answerRepository } from '../data/answer.repository.instance'
import { questionRepository } from '../../ask/data/question.repository.instance'
import type { Question, Answer } from '../../../shared/types/firestore'
import { AppError } from '../../../shared/errors'

export function useQuestionDetailViewModel(questionId: string | undefined) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    if (!questionId) return
    setLoading(true)
    setError(null)
    try {
      const [q, a] = await Promise.all([
        questionRepository.getQuestionById(questionId),
        answerRepository.getAnswersByQuestionId(questionId)
      ])
      setQuestion(q)
      setAnswers(a)
    } catch (err) {
      console.error(err)
      setError('Veriler yüklenirken hata oluştu.')
    } finally {
      setLoading(false)
    }
  }, [questionId])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const submitAnswer = async (isAnonymous: boolean = false) => {
    if (!questionId || !replyContent.trim()) return
    setIsSubmitting(true)
    try {
      await answerRepository.createAnswer({
        questionId,
        parentId: replyingTo,
        content: replyContent,
        isAnonymous,
      })
      setReplyContent('')
      setReplyingTo(null)
      await loadData() // Refresh
    } catch (err) {
      console.error(err)
      alert(err instanceof AppError ? err.message : 'Yanıt gönderilemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeQuestion = async () => {
    if (!questionId || !question) return
    if (!confirm('Bu soruyu kapatmak istediğinize emin misiniz?')) return
    try {
      await answerRepository.closeQuestion(questionId)
      await loadData()
    } catch (err) {
      console.error(err)
      alert('Soru kapatılamadı. Yetkiniz olmayabilir.')
    }
  }

  return {
    question,
    answers,
    loading,
    error,
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    isSubmitting,
    submitAnswer,
    closeQuestion,
  }
}
