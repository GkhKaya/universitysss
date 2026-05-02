import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useCanAccessQuestionApprovals } from '../../shared/auth'
import { useTheme } from '../../shared/theme'
import { questionRepository } from '../ask/data/question.repository.instance'
import type { ApprovedQuestion } from '../ask/data/question.repository'
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

const POPULAR_ITEMS = [
  'Vize sınav takvimi ne zaman açıklanacak?',
  'Kütüphane çalışma saatleri uzatıldı mı?',
  'Erasmus + dil sınavı baraj puanı kaç?',
]

const TOP_USERS = [
  { name: 'Zeynep Yılmaz', major: 'Bilgisayar Müh.', score: 450 },
  { name: 'Caner Kaya', major: 'Mimarlık', score: 380 },
]

export function HomePage() {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const canOpenApprovals = useCanAccessQuestionApprovals()
  const [search, setSearch] = useState('')
  const [feedStatus, setFeedStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [approvedQuestions, setApprovedQuestions] = useState<ApprovedQuestion[]>([])

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

  const filteredQuestions = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr-TR')
    if (!q) return approvedQuestions
    return approvedQuestions.filter((item) => {
      return (
        item.title.toLocaleLowerCase('tr-TR').includes(q) ||
        item.content.toLocaleLowerCase('tr-TR').includes(q) ||
        item.categoryName.toLocaleLowerCase('tr-TR').includes(q)
      )
    })
  }, [approvedQuestions, search])

  return (
    <main className="home-dashboard">
      <aside className="home-sidebar">
        <div className="home-sidebar__brand">Akademik Avlu</div>

        <nav className="home-sidebar__menu" aria-label="Ana menü">
          <button className="home-nav-item home-nav-item--active" type="button">
            Ana Sayfa
          </button>
          <button className="home-nav-item" type="button">
            Kategoriler
          </button>
          <button className="home-nav-item" type="button">
            Burslar
          </button>
          <button className="home-nav-item" type="button">
            Kayıt İşlemleri
          </button>
          <Link to="/my-questions" className="home-nav-item" style={{ display: 'block' }}>
            Sorularım
          </Link>
          {canOpenApprovals ? (
            <Link to="/question-approvals" className="home-nav-item" style={{ display: 'block' }}>
              Onay Bekleyen Sorular
            </Link>
          ) : null}
        </nav>

        <section className="home-filter-block">
          <h2>Hızlı Filtreler</h2>
          <ul>
            <li>Genel SSS</li>
            <li>Öğretmene Sor</li>
            <li>Öğrenciye Sor</li>
          </ul>
        </section>

        <Link to="/ask" className="home-ask-button">
          + Soru Sor
        </Link>
      </aside>

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
          <section className="home-feed">
            <div className="home-feed__header">
              <h1>Güncel Sorular</h1>
              <button type="button" className="home-filter-button">
                Filtrele
              </button>
            </div>

            {feedStatus === 'loading' ? <p className="home-feed-state">Sorular yükleniyor...</p> : null}
            {feedStatus === 'error' ? (
              <p className="home-feed-state">Sorular alınamadı. Lütfen sayfayı yenileyin.</p>
            ) : null}
            {feedStatus === 'ready' && filteredQuestions.length === 0 ? (
              <p className="home-feed-state">Onaylı soru bulunamadı.</p>
            ) : null}

            {feedStatus === 'ready' && filteredQuestions.length > 0 ? (
              <div className="home-feed__list">
                {filteredQuestions.map((item) => (
                  <article key={item.id} className="home-post-card">
                    <div className="home-post-card__meta">
                      <span className="home-tag">Onaylı</span>
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
                {POPULAR_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="home-widget-card">
              <h2>En Çok Katkıda Bulunanlar</h2>
              <ul>
                {TOP_USERS.map((user) => (
                  <li key={user.name} className="home-user-row">
                    <span className="home-user-avatar">{user.name.charAt(0)}</span>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.major}</small>
                    </div>
                    <span className="home-user-score">+{user.score}</span>
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
