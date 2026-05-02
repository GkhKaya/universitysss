import { Link } from 'react-router-dom'
import { useLocale } from '../../shared/locale'
import { useTheme } from '../../shared/theme'
import { useAuth } from '../../shared/auth'
import { useQuestionApprovalsViewModel } from './hooks/useQuestionApprovalsViewModel'
import { Sidebar } from '../../shared/components/Sidebar'
import './QuestionApprovalsPage.css'

function formatDate(ts: { toDate?: () => Date } | null | undefined): string {
  if (!ts || typeof ts.toDate !== 'function') return ''
  return ts.toDate().toLocaleString('tr-TR')
}

export function QuestionApprovalsPage() {
  const { messages } = useLocale()
  const p = messages.questionApprovals
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const vm = useQuestionApprovalsViewModel(p)

  return (
    <main className="qa-dashboard">
      <Sidebar />

      <section className="qa-main">
        <header className="qa-topbar">
          <h1>{p.pageTitle}</h1>
          <div className="qa-topbar__actions">
            <button
              type="button"
              className="qa-top-icon"
              aria-label="Tema değiştir"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              type="button"
              className="qa-top-icon"
              aria-label="Çıkış yap"
              onClick={logout}
              title="Çıkış yap"
            >
              🚪
            </button>
          </div>
        </header>

        <p className="qa-subtitle">{p.pageSubtitle}</p>

        {vm.feedback ? <p className="qa-feedback">{vm.feedback}</p> : null}

        {vm.status === 'loading' ? <p className="qa-state">{p.approvingButton}</p> : null}

        {vm.status === 'forbidden' ? (
          <div className="qa-empty">
            <h2>{p.accessDenied}</h2>
            <Link to="/home" className="qa-btn qa-btn--secondary">
              {p.goHome}
            </Link>
          </div>
        ) : null}

        {vm.status === 'error' ? <p className="qa-state">{p.genericError}</p> : null}

        {vm.status === 'ready' && vm.questions.length === 0 ? (
          <div className="qa-empty">
            <h2>{p.emptyTitle}</h2>
            <p>{p.emptySubtitle}</p>
          </div>
        ) : null}

        {vm.status === 'ready' && vm.questions.length > 0 ? (
          <div className="qa-list">
            {vm.questions.map((question) => (
              <article key={question.id} className="qa-card">
                <div className="qa-card__header">
                  <h2>{question.title}</h2>
                  <button
                    type="button"
                    className="qa-btn qa-btn--primary"
                    onClick={() => {
                      void vm.approve(question.id)
                    }}
                    disabled={vm.approvingId === question.id}
                  >
                    {vm.approvingId === question.id ? p.approvingButton : p.approveButton}
                  </button>
                </div>
                <p>{question.content}</p>
                <div className="qa-card__meta">
                  <span>{question.categoryName}</span>
                  <span>{question.authorName}</span>
                  <span>{question.departmentId}</span>
                  <span>{formatDate(question.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}
