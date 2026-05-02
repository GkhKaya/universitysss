import { useParams, Link } from 'react-router-dom'
import { useAuth, useCanAccessQuestionApprovals } from '../../shared/auth'
import { useTheme } from '../../shared/theme'
import { useQuestionDetailViewModel } from './hooks/useQuestionDetailViewModel'
import type { Answer } from '../../shared/types/firestore'
import { Sidebar } from '../../shared/components/Sidebar'
import './QuestionDetailPage.css'

function formatDate(ts: any): string {
  if (!ts || typeof ts.toDate !== 'function') return ''
  return ts.toDate().toLocaleString('tr-TR')
}

export function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const {
    question,
    answers,
    loading,
    error,
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    isSubmitting,
    submitAnswer,
    closeQuestion,
  } = useQuestionDetailViewModel(id)
  const { logout } = useAuth()
  const canOpenApprovals = useCanAccessQuestionApprovals()

  if (loading) {
    return <div className="qd-loading">Yükleniyor...</div>
  }

  if (error || !question) {
    return (
      <div className="qd-error">
        <p>{error || 'Soru bulunamadı.'}</p>
        <Link to="/home">Ana sayfaya dön</Link>
      </div>
    )
  }

  const isAdminOrTeacher = user?.roleId === 'admin' || user?.roleId === 'teacher'
  
  // Organizes answers into a tree structure
  const topLevelAnswers = answers.filter((a) => !a.parentId)
  const getReplies = (parentId: string) => answers.filter((a) => a.parentId === parentId)

  const renderAnswer = (answer: Answer, depth: number = 0) => {
    const replies = getReplies(answer.id!)
    return (
      <div key={answer.id} className={`qd-answer qd-answer--depth-${depth}`}>
        <div className="qd-answer__header">
          <span className="qd-answer__author">
            {answer.isAnonymous ? 'Anonim' : answer.authorName}
          </span>
          {answer.authorRoleId === 'teacher' && <span className="qd-badge-teacher">Öğretmen</span>}
          <span className="qd-answer__time">{formatDate(answer.createdAt)}</span>
        </div>
        <p className="qd-answer__content">{answer.content}</p>
        
        {!question.status && (
          <div className="qd-answer__actions">
            <button
              className="qd-btn-link"
              onClick={() => setReplyingTo(replyingTo === answer.id ? null : answer.id!)}
            >
              {replyingTo === answer.id ? 'İptal' : 'Yanıtla'}
            </button>
          </div>
        )}

        {replyingTo === answer.id && (
          <div className="qd-reply-box">
            <textarea
              className="qd-textarea"
              placeholder="Yanıtınızı buraya yazın..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
            />
            <button
              className="qd-btn-submit"
              disabled={isSubmitting || !replyContent.trim()}
              onClick={() => submitAnswer(false)}
            >
              Gönder
            </button>
          </div>
        )}

        {/* Render child replies */}
        {replies.length > 0 && (
          <div className="qd-replies">
            {replies.map((reply) => renderAnswer(reply, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="home-dashboard">
      <Sidebar />

      <section className="home-main">
        <header className="home-topbar">
          <div className="home-search" style={{ border: 'none', background: 'transparent' }}>
            {/* Boş arama alanı yer tutucu */}
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
          <div className="qd-container">
            <header className="qd-header">
              <Link to="/home" className="qd-back-link">← Ana Sayfaya Dön</Link>
            </header>

            <article className="qd-question-card">
              <div className="qd-question-card__header">
                <h1 className="qd-title">{question.title}</h1>
                {isAdminOrTeacher && !question.status && (
                  <button className="qd-btn-close" onClick={closeQuestion}>
                    Soruyu Kapat
                  </button>
                )}
              </div>
              
              <div className="qd-meta">
                <span className="qd-meta__author">{question.isAnonymous ? 'Anonim' : question.authorName}</span>
                <span className="qd-meta__chip">{question.categoryName}</span>
                <span className="qd-meta__time">{formatDate(question.createdAt)}</span>
                {question.status && <span className="qd-status-closed">Kapatıldı / Yanıtlandı</span>}
              </div>

              <p className="qd-content">{question.content}</p>
            </article>

            <section className="qd-answers-section">
              <h2 className="qd-answers-title">{answers.length} Cevap</h2>
              
              {!question.status && replyingTo === null && (
                <div className="qd-main-reply">
                  <h3>Cevap Yaz</h3>
                  <textarea
                    className="qd-textarea"
                    placeholder="Cevabınızı buraya yazın..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={4}
                  />
                  <button
                    className="qd-btn-submit"
                    disabled={isSubmitting || !replyContent.trim()}
                    onClick={() => submitAnswer(false)}
                  >
                    Gönder
                  </button>
                </div>
              )}

              <div className="qd-answers-list">
                {topLevelAnswers.map((a) => renderAnswer(a, 0))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
