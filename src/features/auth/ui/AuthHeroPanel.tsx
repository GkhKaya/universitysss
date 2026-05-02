import './AuthHeroPanel.css'

export type AuthHeroStrings = {
  heroTitle: string
  heroSubtitle: string
  heroImageAlt: string
}

type AuthHeroPanelProps = {
  strings: AuthHeroStrings
}

export function AuthHeroPanel({ strings }: AuthHeroPanelProps) {
  return (
    <section className="auth-hero" aria-labelledby="auth-hero-title">
      <div className="auth-hero__content">
        <div className="auth-hero__figure">
          <img
            className="auth-hero__image"
            src="/images/register-hero.png"
            alt={strings.heroImageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
        <h2 id="auth-hero-title" className="auth-hero__title">
          {strings.heroTitle}
        </h2>
        <p className="auth-hero__subtitle">{strings.heroSubtitle}</p>
      </div>
    </section>
  )
}
