import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '../../shared/locale'
import './MyQuestionsPage.css'

interface MockQuestion {
  id: string
  title: string
  excerpt: string
  category: string
  status: 'pending' | 'answered'
  answers: number
  likes: number
  timeAgo: string
}

const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: 'q-1',
    title: 'Staj başvurusu için gerekli belgeler neler?',
    excerpt:
      'Yaz stajı için hangi belgeleri hazırlamam gerektiğini öğrenmek istiyorum. SGK kaydı ve sigorta konusunda net bilgi bulamadım.',
    category: 'STAJ',
    status: 'answered',
    answers: 3,
    likes: 7,
    timeAgo: '2 gün önce',
  },
  {
    id: 'q-2',
    title: 'Erasmus başvurusunda dil sınavı zorunlu mu?',
    excerpt:
      'Erasmus programına başvurmak istiyorum fakat hangi dil sınavlarının kabul edildiğini ve minimum puan gereksinimlerini bilmiyorum.',
    category: 'ERASMUS',
    status: 'pending',
    answers: 0,
    likes: 2,
    timeAgo: '5 saat önce',
  },
  {
    id: 'q-3',
    title: 'Çift anadal başvurusu ne zaman açılır?',
    excerpt:
      'Bu dönem çift anadal başvurusu yapabilmek için son tarihleri ve gerekli GPA şartını öğrenmek istiyorum.',
    category: 'ÇİFT ANADAL',
    status: 'pending',
    answers: 0,
    likes: 5,
    timeAgo: '1 gün önce',
  },
]

type FilterStatus = 'all' | 'pending' | 'answered'

export function MyQuestionsPage() {
  const { messages } = useLocale()
  const m = messages.myQuestions
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    }
    return 'light'
  })

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const filtered =
    filter === 'all' ? MOCK_QUESTIONS : MOCK_QUESTIONS.filter((q) => q.status === filter)

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
            <span className="mq-avatar" aria-hidden="true">
              G
            </span>
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
            </button>
            <button
              type="button"
              className={`mq-filter-btn ${filter === 'pending' ? 'mq-filter-btn--active' : ''}`}
              onClick={() => { setFilter('pending') }}
            >
              {m.statusPending}
            </button>
            <button
              type="button"
              className={`mq-filter-btn ${filter === 'answered' ? 'mq-filter-btn--active' : ''}`}
              onClick={() => { setFilter('answered') }}
            >
              {m.statusAnswered}
            </button>
          </div>

          {filtered.length === 0 ? (
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
          ) : (
            <div className="mq-list">
              {filtered.map((q) => (
                <article key={q.id} className="mq-card">
                  <div className="mq-card__header">
                    <h2 className="mq-card__title">{q.title}</h2>
                    <span
                      className={`mq-card__status ${
                        q.status === 'answered'
                          ? 'mq-card__status--answered'
                          : 'mq-card__status--pending'
                      }`}
                    >
                      {q.status === 'answered' ? m.questionAnswered : m.questionPending}
                    </span>
                  </div>
                  <p className="mq-card__excerpt">{q.excerpt}</p>
                  <div className="mq-card__meta">
                    <span className="mq-card__chip">{q.category}</span>
                    <span className="mq-card__stat">
                      💬 {q.answers} {m.questionAnswers}
                    </span>
                    <span className="mq-card__stat">
                      👍 {q.likes} {m.questionLikes}
                    </span>
                    <span className="mq-card__time">{q.timeAgo}</span>
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
