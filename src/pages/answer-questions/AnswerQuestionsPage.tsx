import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useCanAccessQuestionApprovals } from '../../shared/auth'
import { useTheme } from '../../shared/theme'
import { questionRepository } from '../ask/data/question.repository.instance'
import type { ApprovedQuestion } from '../ask/data/question.repository'
import { Sidebar } from '../../shared/components/Sidebar'
import '../home/HomePage.css' // Reuse home page styles for the list

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

export function AnswerQuestionsPage() {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const canOpenApprovals = useCanAccessQuestionApprovals()
  const [search, setSearch] = useState('')
  const [feedStatus, setFeedStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [unansweredQuestions, setUnansweredQuestions] = useState<ApprovedQuestion[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setFeedStatus('loading')
      try {
        const rows = await questionRepository.getApprovedQuestions()
        if (!cancelled) {
          // Sadece cevap bekleyenleri filtrele
          setUnansweredQuestions(rows.filter(q => q.answerIds.length === 0))
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

  const filteredQuestions = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr-TR')
    if (!q) return unansweredQuestions
    return unansweredQuestions.filter((item) => {
      return (
        item.title.toLocaleLowerCase('tr-TR').includes(q) ||
        item.content.toLocaleLowerCase('tr-TR').includes(q) ||
        item.categoryName.toLocaleLowerCase('tr-TR').includes(q)
      )
    })
  }, [unansweredQuestions, search])

  return (
    <main className="home-dashboard">
      <Sidebar />

      <section className="home-main">
        <header className="home-topbar">
          <input
            className="home-search"
            placeholder="Cevaplanmamış sorularda ara..."
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
            <button type="button" className="home-top-icon" aria-label="Bildirimler">
              🔔
            </button>
            <span className="home-avatar" aria-hidden="true" title="Profil">
              G
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
              <h1>Cevap Bekleyen Sorular</h1>
            </div>

            {feedStatus === 'loading' ? <p className="home-feed-state">Sorular yükleniyor...</p> : null}
            {feedStatus === 'error' ? (
              <p className="home-feed-state">Sorular alınamadı. Lütfen sayfayı yenileyin.</p>
            ) : null}
            {feedStatus === 'ready' && filteredQuestions.length === 0 ? (
              <p className="home-feed-state">Cevap bekleyen soru bulunamadı. Harika!</p>
            ) : null}

            {feedStatus === 'ready' && filteredQuestions.length > 0 ? (
              <div className="home-feed__list">
                {filteredQuestions.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/question/${item.id}`} 
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <article className="home-post-card" style={{ cursor: 'pointer', border: '1px solid var(--color-border)' }}>
                      <div className="home-post-card__meta">
                        <span className="home-tag" style={{ background: 'var(--color-warning)', color: '#fff', borderColor: 'var(--color-warning)' }}>
                          Cevap Bekliyor
                        </span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>

                      <h2>{item.title}</h2>
                      <p>{item.content}</p>

                      <div className="home-post-card__chips">
                        <span>{item.categoryName}</span>
                      </div>

                      <div className="home-post-card__footer">
                        <div className="home-post-card__stats">
                          <span>👍 {item.voteCount}</span>
                          <span>💬 0 Yanıt</span>
                        </div>
                        <span className="home-post-card__author">{item.authorName}</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  )
}
