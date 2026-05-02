import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../shared/auth'
import { useTheme } from '../../shared/theme'
import dpuFaqData from '../../data/dpu-faq.json'
import { Sidebar } from '../../shared/components/Sidebar'
import '../home/HomePage.css' // We can reuse the dashboard styling

export function FaqPage() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleAccordion = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <main className="home-dashboard">
      <Sidebar />

      <section className="home-main">
        <header className="home-topbar">
          <div className="home-search" style={{ border: 'none', background: 'transparent' }}>
            {/* Boş arama alanı */}
          </div>
          <div className="home-topbar__actions">
            <button
              type="button"
              className="home-theme-toggle"
              aria-label="Tema değiştir"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button type="button" className="home-top-icon" aria-label="Bildirimler">
              🔔
            </button>
            <span className="home-avatar" aria-hidden="true" title="Profil">
              {user?.displayName?.[0] || 'G'}
            </span>
            <button
              type="button"
              className="home-top-icon"
              aria-label="Çıkış yap"
              onClick={logout}
              title="Çıkış yap"
            >
              🚪
            </button>
          </div>
        </header>

        <div className="home-main-content">
          <section className="home-feed" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className="home-feed__header">
              <h1>DPÜ Sıkça Sorulan Sorular</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {dpuFaqData.map((faq) => (
                <article
                  key={faq.id}
                  style={{
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    style={{
                      width: '100%',
                      padding: '1.25rem',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      color: 'var(--color-text)',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    {faq.question}
                    <span style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>
                      {expandedId === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {expandedId === faq.id && (
                    <div style={{ padding: '0 1.25rem 1.25rem', lineHeight: '1.6', color: 'var(--color-text-muted)' }}>
                      {faq.answer}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
