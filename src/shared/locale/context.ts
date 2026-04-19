import { createContext } from 'react'
import type { AppMessages, Locale } from './types'

export type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: AppMessages
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
