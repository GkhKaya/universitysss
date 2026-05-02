import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../shared/auth'
import { useLocale } from '../../shared/locale'
import { useTheme } from '../../shared/theme'
import { useMyQuestionsViewModel } from './hooks/useMyQuestionsViewModel'
import './MyQuestionsPage.css'

type FilterStatus = 'all' | 'pending' | 'answered'

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

export function MyQuestionsPage() {
  const { messages } = useLocale()
  const m = messages.myQuestions
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const { questions, status } = useMyQuestionsViewModel()
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filtered =
    filter === 'all'
      ? questions
      : questions.filter((q) => (filter === 'answered' ? q.status : !q.status))

  return (
    <main className="mq-dashboard">
      <aside className="mq-sidebar">
        <div className="mq-sidebar__brand">Akademik Avlu</div>
        <nav className="mq-sidebar__menu" aria-label="Ana menü">
          <Link to="/home" className="mq-nav-item">
            {m.menuHome}
          </Link>
          <span className="mq-nav-item">{m.menuCategories}</span>
          <span className="mq-nav-item">{m.menuScholarships}</span>
          <span className="mq-nav-item">{m.menuRegistration}</span>
          <span className="mq-nav-item mq-nav-item--active">{m.menuMyQuestions}</span>
          <Link to="/ask" className="mq-nav-item">
            {m.menuAsk}
          </Link>
        </nav>
        <Link to="/ask" className="mq-sidebar__ask-btn">
          {m.askButton}
        </Link>
      </aside>

      <section className="mq-main">
        <header className="mq-topbar">
          <input
            className="mq-search"
            placeholder={m.searchPlaceholder}
            aria-label="Soru arama"
          />
          <div className="mq-topbar__actions">
            <button
              type="button"
              className="mq-theme-toggle"
              aria-label="Tema değiştir"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button type="button" className="mq-top-icon" aria-label="Bildirimler">
              🔔
            </button>
            <span className="mq-avatar" aria-hidden="true" title="Profil">
              G
            </span>
            <button
              type="button"
              className="mq-top-icon"
              aria-label="Çıkış yap"
              onClick={logout}
              title="Çıkış yap"
            >
              🚪
            </button>
          </div>
        </header>

        <div className="mq-content">
          <div className="mq-filters">
            <button
              type="button"
              className={`mq-filter-btn ${filter === 'all' ? 'mq-filter-btn--active' : ''}`}
              onClick={() => { setFilter('all') }}
            >
              {m.statusAll}
              {status === 'ready' && ` (${questions.length})`}
            </button>
            <button
              type="button"
              className={`mq-filter-btn ${filter === 'pending' ? 'mq-filter-btn--active' : ''}`}
              onClick={() => { setFilter('pending') }}
            >
              {m.statusPending}
              {status === 'ready' && ` (${questions.filter((q) => !q.status).length})`}
            </button>
            <button
              type="button"
              className={`mq-filter-btn ${filter === 'answered' ? 'mq-filter-btn--active' : ''}`}
              onClick={() => { setFilter('answered') }}
            >
              {m.statusAnswered}
              {status === 'ready' && ` (${questions.filter((q) => q.status).length})`}
            </button>
          </div>

          {/* Yükleniyor */}
          {status === 'loading' && (
            <div className="mq-loading">
              <span className="mq-loading__spinner" aria-hidden="true" />
              <p>Sorular yükleniyor…</p>
            </div>
          )}

          {/* Hata */}
          {(status === 'error' || status === 'unauthenticated') && (
            <div className="mq-error">
              <span aria-hidden="true">⚠️</span>
              <p>
                {status === 'unauthenticated'
                  ? 'Soruları görmek için giriş yapmanız gerekiyor.'
                  : 'Sorular yüklenirken hata oluştu. Sayfayı yenileyin.'}
              </p>
            </div>
          )}

          {/* Boş durum */}
          {status === 'ready' && filtered.length === 0 && (
            <div className="mq-empty">
              <span className="mq-empty__icon" aria-hidden="true">
                🗂️
              </span>
              <h1 className="mq-empty__title">{m.emptyTitle}</h1>
              <p className="mq-empty__subtitle">{m.emptySubtitle}</p>
              <Link to="/ask" className="mq-empty__btn">
                {m.askButton}
              </Link>
            </div>
          )}

          {/* Soru kartları */}
          {status === 'ready' && filtered.length > 0 && (
            <div className="mq-list">
              {filtered.map((q) => (
                <article key={q.id} className="mq-card">
                  <div className="mq-card__header">
                    <h2 className="mq-card__title">{q.title}</h2>
                    <span
                      className={`mq-card__status ${
                        q.status ? 'mq-card__status--answered' : 'mq-card__status--pending'
                      }`}
                    >
                      {q.status ? m.questionAnswered : m.questionPending}
                    </span>
                  </div>
                  <p className="mq-card__excerpt">{q.content}</p>
                  <div className="mq-card__meta">
                    <span className="mq-card__chip">{q.categoryName}</span>
                    <span className="mq-card__stat">
                      💬 {q.answerIds.length} {m.questionAnswers}
                    </span>
                    <span className="mq-card__stat">
                      👍 {q.voteCount} {m.questionLikes}
                    </span>
                    <span className="mq-card__time">{formatDate(q.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
