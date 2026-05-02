import type { LoginMessages } from '../locale/types'

export const LOGIN_MESSAGE_KEY = {
  LOGIN_REQUIRED_FIELDS: 'errorRequired',
  LOGIN_INVALID_CREDENTIALS: 'errorInvalidCredentials',
  LOGIN_FAILED: 'errorLoginFailed',
} as const satisfies Record<string, keyof LoginMessages>

export type LoginAppErrorCode = keyof typeof LOGIN_MESSAGE_KEY

export function resolveLoginErrorMessage(code: LoginAppErrorCode, messages: LoginMessages): string {
  const key = LOGIN_MESSAGE_KEY[code]
  return messages[key]
}

export function isLoginAppErrorCode(code: string): code is LoginAppErrorCode {
  return Object.prototype.hasOwnProperty.call(LOGIN_MESSAGE_KEY, code)
}
