import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en } from './catalog/en'
import { tr } from './catalog/tr'
import { LocaleContext } from './context'
import type { AppMessages, Locale } from './types'

const STORAGE_KEY = 'universitysss.locale'

const catalog: Record<Locale, AppMessages> = {
  tr,
  en,
}

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'tr'
  }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'tr') {
    return stored
  }
  return 'tr'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const messages = useMemo(() => catalog[locale], [locale])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      messages,
    }),
    [locale, setLocale, messages],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
