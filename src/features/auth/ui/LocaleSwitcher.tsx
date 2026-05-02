import { useLocale } from '../../../shared/locale'
import type { Locale } from '../../../shared/locale/types'
import './LocaleSwitcher.css'

const LOCALES: Locale[] = ['tr', 'en']

export function LocaleSwitcher({ label }: { label: string }) {
  const { locale, setLocale } = useLocale()

  return (
    <div className="locale-switcher" role="group" aria-label={label}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`locale-switcher__btn${locale === code ? ' locale-switcher__btn--active' : ''}`}
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
