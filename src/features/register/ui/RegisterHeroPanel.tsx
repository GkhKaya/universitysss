import type { RegisterMessages } from '../../../shared/locale/types'
import './RegisterHeroPanel.css'

type RegisterHeroPanelProps = {
  strings: Pick<RegisterMessages, 'heroTitle' | 'heroSubtitle' | 'heroImageAlt'>
}

export function RegisterHeroPanel({ strings }: RegisterHeroPanelProps) {
  return (
    <section className="register-hero" aria-labelledby="register-hero-title">
      <div className="register-hero__content">
        <div className="register-hero__figure">
          <img
            className="register-hero__image"
            src="/images/register-hero.png"
            alt={strings.heroImageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
        <h2 id="register-hero-title" className="register-hero__title">
          {strings.heroTitle}
        </h2>
        <p className="register-hero__subtitle">{strings.heroSubtitle}</p>
      </div>
    </section>
  )
}
