import { useCallback, useState } from 'react'
import {
  isAppError,
  isLoginAppErrorCode,
  resolveLoginErrorMessage,
} from '../../../../shared/errors'
import type { LoginMessages } from '../../../../shared/locale/types'
import { loginRepository } from '../data/login.repository.instance'

export type LoginFormStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }
  | { kind: 'success'; message: string }

export function useLoginViewModel(messages: LoginMessages) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<LoginFormStatus>({ kind: 'idle' })

  const resetFeedback = useCallback(() => {
    setStatus({ kind: 'idle' })
  }, [])

  const submit = useCallback(async () => {
    resetFeedback()
    const mail = email.trim()
    const pass = password

    if (!mail || !pass) {
      setStatus({
        kind: 'error',
        message: resolveLoginErrorMessage('LOGIN_REQUIRED_FIELDS', messages),
      })
      return
    }

    setStatus({ kind: 'submitting' })
    try {
      await loginRepository.signIn(mail, pass)
      setStatus({ kind: 'success', message: messages.successLogin })
    } catch (err) {
      if (isAppError(err) && isLoginAppErrorCode(err.code)) {
        setStatus({
          kind: 'error',
          message: resolveLoginErrorMessage(err.code, messages),
        })
        return
      }
      setStatus({
        kind: 'error',
        message: resolveLoginErrorMessage('LOGIN_FAILED', messages),
      })
    }
  }, [email, messages, password, resetFeedback])

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    status,
    submit,
    resetFeedback,
  }
}
