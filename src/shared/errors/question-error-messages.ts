import type { AskMessages } from '../locale/types'

export const QUESTION_MESSAGE_KEY = {
  QUESTION_REQUIRED_FIELDS: 'errorRequired',
  QUESTION_CATEGORY_REQUIRED: 'errorCategoryRequired',
  QUESTION_TITLE_TOO_LONG: 'errorTitleTooLong',
  QUESTION_CONTENT_TOO_SHORT: 'errorContentTooShort',
  QUESTION_UNAUTHENTICATED: 'errorUnauthenticated',
  QUESTION_PROFILE_NOT_FOUND: 'errorProfileNotFound',
  QUESTION_DEPARTMENT_REQUIRED: 'errorDepartmentRequired',
  QUESTION_DEPARTMENT_NOT_FOUND: 'errorDepartmentNotFound',
  QUESTION_CATEGORY_NOT_FOUND: 'errorCategoryNotFound',
  QUESTION_APPROVAL_FORBIDDEN: 'errorApprovalForbidden',
  QUESTION_APPROVAL_UPDATE_FAILED: 'errorApprovalUpdateFailed',
  QUESTION_CREATE_FAILED: 'errorCreateFailed',
} as const satisfies Record<string, keyof AskMessages>

export type QuestionAppErrorCode = keyof typeof QUESTION_MESSAGE_KEY

export function resolveQuestionErrorMessage(
  code: QuestionAppErrorCode,
  messages: AskMessages,
): string {
  const key = QUESTION_MESSAGE_KEY[code]
  return messages[key]
}

export function isQuestionAppErrorCode(code: string): code is QuestionAppErrorCode {
  return Object.prototype.hasOwnProperty.call(QUESTION_MESSAGE_KEY, code)
}
