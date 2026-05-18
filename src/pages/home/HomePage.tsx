import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../shared/auth'
import { useTheme } from '../../shared/theme'
import { questionRepository } from '../ask/data/question.repository.instance'
import type { ApprovedQuestion } from '../ask/data/question.repository'
import { Sidebar } from '../../shared/components/Sidebar'
import './HomePage.css'

function formatDate(ts: { toDate?: () => Date } | null | undefined): string {
  if (!ts || typeof ts.toDate !== 'function') return ''
  const date = ts.toDate()
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  if (diffMin < 2) return 'Az önce'
  if (diffMin < 60) return `${diffMin} dakika önce`
  if (diffHour < 24) return `${diffHour} saat önce`
  if (diffDay < 7) return `${diffDay} gün önce`
  return date.toLocaleDateString('tr-TR')
}

export function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [feedStatus, setFeedStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [approvedQuestions, setApprovedQuestions] = useState<ApprovedQuestion[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü')
  const [statusFilter, setStatusFilter] = useState<'open' | 'closed'>('open')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setFeedStatus('loading')
      try {
        const rows = await questionRepository.getApprovedQuestions()
        if (!cancelled) {
          setApprovedQuestions(rows)
          setFeedStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setFeedStatus('error')
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(approvedQuestions.map((q) => q.categoryName).filter(Boolean))
    return ['Tümü', ...Array.from(cats)]
  }, [approvedQuestions])

  const filteredQuestions = useMemo(() => {
    let result = approvedQuestions.filter(q => statusFilter === 'open' ? !q.status : q.status)
    
    if (selectedCategory !== 'Tümü') {
      result = result.filter((q) => q.categoryName === selectedCategory)
    }
    const q = search.trim().toLocaleLowerCase('tr-TR')
    if (!q) return result
    return result.filter((item) => {
      const title = item.title ? item.title.toLocaleLowerCase('tr-TR') : ''
      const content = item.content ? item.content.toLocaleLowerCase('tr-TR') : ''
      const category = item.categoryName ? item.categoryName.toLocaleLowerCase('tr-TR') : ''
      return title.includes(q) || content.includes(q) || category.includes(q)
    })
  }, [approvedQuestions, search, selectedCategory, statusFilter])

  const popularQuestions = useMemo(
    () =>
      [...approvedQuestions]
        .sort((a, b) => b.answerIds.length - a.answerIds.length)
        .slice(0, 3),
    [approvedQuestions],
  )

  return (
    <main className="home-dashboard">
      <Sidebar />

      <section className="home-main">
        <header className="home-topbar">
          <input
            className="home-search"
            placeholder="Sorularda ara veya yeni bir soru sor..."
            aria-label="Soru arama"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
            }}
          />
          <div className="home-topbar__actions">
            <button
              type="button"
              className="home-theme-toggle"
              aria-label="Tema değiştir"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <Link to="/profile" className="home-avatar" title="Profil">
              {user?.displayName?.[0]?.toUpperCase() || 'G'}
            </Link>
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
          <section className="home-feed">
            <div className="home-feed__header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ margin: 0 }}>Güncel Sorular</h1>
                <select
                  className="home-filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Kategori filtrele"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => setStatusFilter('open')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    color: statusFilter === 'open' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    borderBottom: statusFilter === 'open' ? '2px solid var(--color-accent)' : '2px solid transparent',
                    fontWeight: statusFilter === 'open' ? 600 : 400,
                    fontSize: '1rem'
                  }}
                >
                  Açık Sorular
                </button>
                <button
                  onClick={() => setStatusFilter('closed')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    color: statusFilter === 'closed' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    borderBottom: statusFilter === 'closed' ? '2px solid var(--color-accent)' : '2px solid transparent',
                    fontWeight: statusFilter === 'closed' ? 600 : 400,
                    fontSize: '1rem'
                  }}
                >
                  Kapalı Sorular
                </button>
              </div>
            </div>

            {feedStatus === 'loading' ? <p className="home-feed-state">Sorular yükleniyor...</p> : null}
            {feedStatus === 'error' ? (
              <p className="home-feed-state">Sorular alınamadı. Lütfen sayfayı yenileyin.</p>
            ) : null}
            {feedStatus === 'ready' && filteredQuestions.length === 0 ? (
              <div className="home-feed-state" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                  {search ? `"${search}" ile ilgili soru bulunamadı.` : "Henüz onaylı soru bulunmamaktadır."}
                </p>
                {search && (
                  <Link 
                    to={`/ask`} 
                    className="home-ask-button" 
                    style={{ display: 'inline-block', width: 'auto', padding: '0.5rem 1.5rem' }}
                  >
                    Bu Soruyu Sen Sor
                  </Link>
                )}
              </div>
            ) : null}

            {feedStatus === 'ready' && filteredQuestions.length > 0 ? (
              <div className="home-feed__list">
                {filteredQuestions.map((item) => (
                  <article key={item.id} className="home-post-card">
                    <div className="home-post-card__meta">
                      <span className="home-tag">Onaylı</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>

                    <h2>
                      <Link to={`/question/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {item.title}
                      </Link>
                    </h2>
                    <p>{item.content}</p>

                    <div className="home-post-card__chips">
                      <span>{item.categoryName}</span>
                    </div>

                    <div className="home-post-card__footer">
                      <div className="home-post-card__stats">
                        <span>👍 {item.voteCount}</span>
                        <span>💬 {item.answerIds.length} Yanıt</span>
                      </div>
                      <span className="home-post-card__author">{item.authorName}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>

          <aside className="home-widgets">
            <section className="home-widget-card">
              <h2>Popüler Sorular</h2>
              <ul>
                {feedStatus === 'loading' && (
                  <li className="home-popular-placeholder">Yükleniyor...</li>
                )}
                {feedStatus === 'ready' && popularQuestions.length === 0 && (
                  <li className="home-popular-placeholder">Henüz soru yok.</li>
                )}
                {feedStatus === 'ready' &&
                  popularQuestions.map((item) => (
                    <li key={item.id} className="home-popular-item">
                      <Link to={`/question/${item.id}`} className="home-popular-link">
                        {item.title}
                      </Link>
                      <span className="home-popular-badge">💬 {item.answerIds.length}</span>
                    </li>
                  ))}
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
