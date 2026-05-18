import { useMemo, useState } from 'react'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü')

  const categories = useMemo(() => {
    // Cast faq to any if category is not yet in the inferred type from json
    const cats = new Set(dpuFaqData.map((faq: any) => faq.category).filter(Boolean))
    return ['Tümü', ...Array.from(cats)]
  }, [])

  const filteredFaqs = useMemo(() => {
    let result = dpuFaqData as any[]
    if (selectedCategory !== 'Tümü') {
      result = result.filter((faq) => faq.category === selectedCategory)
    }
    
    if (!searchQuery.trim()) return result
    
    const q = searchQuery.toLowerCase('tr-TR')
    return result.filter(
      (faq) =>
        faq.question.toLowerCase('tr-TR').includes(q) ||
        faq.answer.toLowerCase('tr-TR').includes(q)
    )
  }, [searchQuery, selectedCategory])

  const toggleAccordion = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <main className="home-dashboard">
      <Sidebar />

      <section className="home-main">
        <header className="home-topbar">
          <input
            className="home-search"
            placeholder="Sıkça sorulan sorularda ara..."
            aria-label="SSS Arama"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              <select
                className="home-filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Kategori filtrele"
              >
                {categories.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {filteredFaqs.length === 0 ? (
                <div className="home-feed-state" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>
                    "{searchQuery}" ile ilgili sonuç bulunamadı.
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span>{faq.question}</span>
                        {(faq as any).category && (
                          <span className="home-tag" style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>
                            {(faq as any).category}
                          </span>
                        )}
                      </div>
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
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
