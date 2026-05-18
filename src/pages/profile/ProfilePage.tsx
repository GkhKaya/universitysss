import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../shared/theme'
import { useAuth } from '../../shared/auth'
import { Sidebar } from '../../shared/components/Sidebar'
import { useProfileViewModel } from './hooks/useProfileViewModel'
import '../home/HomePage.css'
import '../ask/AskPage.css' // Form elemanları için AskPage.css eklendi

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

export function ProfilePage() {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const {
    profile,
    status,
    departments,
    askedQuestions,
    answeredQuestions,
    isUpdating,
    updateError,
    updateSuccess,
    updateProfile,
  } = useProfileViewModel()

  const [displayName, setDisplayName] = useState('')
  const [departmentId, setDepartmentId] = useState('')

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName)
      setDepartmentId(profile.departmentId)
    }
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(displayName, departmentId)
  }

  if (status === 'loading') {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>
  }

  if (!profile) return null

  return (
    <main className="home-dashboard">
      <Sidebar />

      <section className="home-main">
        <header className="home-topbar">
          <div style={{ flex: 1 }} />
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

            <span className="home-avatar" aria-hidden="true" title="Profil">
              {profile.displayName[0]?.toUpperCase() || 'G'}
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
              <h1>Profilim</h1>
            </div>

            <div className="ask-form-card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                <div style={{
                  width: '5rem', height: '5rem', borderRadius: '999px',
                  background: 'var(--color-accent)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', fontWeight: 700
                }}>
                  {profile.displayName[0]?.toUpperCase() || 'G'}
                </div>
                <div>
                  <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', color: 'var(--color-text)' }}>{profile.displayName}</h1>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{profile.email}</p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    <span className="home-tag">{profile.departmentName}</span>
                  </p>
                </div>
              </div>

              <section style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', margin: '0 0 1.25rem', color: 'var(--color-text)' }}>Bilgileri Güncelle</h2>
                <form className="ask-form" onSubmit={handleSubmit}>
                  <div className="ask-field">
                    <label className="ask-field__label" htmlFor="displayName">Ad Soyad</label>
                    <input
                      id="displayName"
                      className="ask-field__input"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="ask-field">
                    <label className="ask-field__label" htmlFor="departmentId">Bölüm</label>
                    <select
                      id="departmentId"
                      className="ask-field__select"
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Bölüm Seçiniz
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.data.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <button type="submit" className="ask-btn ask-btn--primary" disabled={isUpdating}>
                      {isUpdating ? 'Güncelleniyor...' : 'Kaydet'}
                    </button>
                  </div>

                  {updateError && <div className="ask-error">{updateError}</div>}
                  {updateSuccess && <div className="ask-success" style={{ padding: '0.75rem', textAlign: 'left' }}><p style={{ margin: 0 }}>{updateSuccess}</p></div>}
                </form>
              </section>
            </div>

            <div className="home-feed__header" style={{ marginTop: '2rem' }}>
              <h1>Sorduğum Sorular ({askedQuestions.length})</h1>
            </div>

            {askedQuestions.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>Henüz soru sormadınız.</p>
            ) : (
              <div className="home-feed__list">
                {askedQuestions.map((q) => (
                  <article key={q.id} className="home-post-card">
                    <div className="home-post-card__meta">
                      <span className="home-tag">Sorum</span>
                      <span>{formatDate(q.createdAt)}</span>
                    </div>

                    <h2>
                      <Link to={`/question/${q.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {q.title}
                      </Link>
                    </h2>
                    <p>{q.content}</p>

                    <div className="home-post-card__chips">
                      <span>{q.categoryName}</span>
                    </div>

                    <div className="home-post-card__footer">
                      <div className="home-post-card__stats">
                        <span>👍 {q.voteCount || 0}</span>
                        <span>💬 {q.answerIds?.length || 0} Yanıt</span>
                      </div>
                      <span className="home-post-card__author">{q.authorName}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="home-feed__header" style={{ marginTop: '2rem' }}>
              <h1>Cevapladığım Sorular ({answeredQuestions.length})</h1>
            </div>

            {answeredQuestions.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>Henüz hiçbir soruyu cevaplamadınız.</p>
            ) : (
              <div className="home-feed__list">
                {answeredQuestions.map((q) => (
                  <article key={q.id} className="home-post-card">
                    <div className="home-post-card__meta">
                      <span className="home-tag" style={{ background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' }}>Yanıtladım</span>
                      <span>{formatDate(q.createdAt)}</span>
                    </div>

                    <h2>
                      <Link to={`/question/${q.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {q.title}
                      </Link>
                    </h2>
                    <p>{q.content}</p>

                    <div className="home-post-card__chips">
                      <span>{q.categoryName}</span>
                    </div>

                    <div className="home-post-card__footer">
                      <div className="home-post-card__stats">
                        <span>👍 {q.voteCount || 0}</span>
                        <span>💬 {q.answerIds?.length || 0} Yanıt</span>
                      </div>
                      <span className="home-post-card__author">{q.authorName}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <br />
          </section>
        </div>
      </section>
    </main>
  )
}
