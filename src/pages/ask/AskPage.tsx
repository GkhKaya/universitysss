import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AskPage.css'

const QUESTION_CATEGORIES = [
  'Kayıt & Hesap',
  'Dersler & Sınavlar',
  'Bölüm & Fakülte',
  'Kampüs Hayatı',
  'Diğer',
]

type AskStatus = 'idle' | 'submitting' | 'success' | 'error'

export function AskPage() {
  const [askTitle, setAskTitle] = useState('')
  const [askBody, setAskBody] = useState('')
  const [askCategory, setAskCategory] = useState('')
  const [askStatus, setAskStatus] = useState<AskStatus>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!askTitle.trim() || !askBody.trim() || !askCategory) {
      setAskStatus('error')
      return
    }
    setAskStatus('submitting')
    // Gerçek gönderim burada Firebase'e yapılacak
    setTimeout(() => {
      setAskStatus('success')
      setAskTitle('')
      setAskBody('')
      setAskCategory('')
    }, 1200)
  }

  const resetForm = () => setAskStatus('idle')

  return (
    <main className="ask-dashboard">
      <aside className="ask-sidebar">
        <div className="ask-sidebar__brand">Akademik Avlu</div>
        <nav className="ask-sidebar__menu" aria-label="Ana menü">
          <Link to="/home" className="ask-nav-item">
            Ana Sayfa
          </Link>
          <span className="ask-nav-item">Kategoriler</span>
          <span className="ask-nav-item">Burslar</span>
          <span className="ask-nav-item">Kayıt İşlemleri</span>
          <span className="ask-nav-item">Sorularım</span>
          <span className="ask-nav-item ask-nav-item--active">Soru Sor</span>
        </nav>
      </aside>

      <section className="ask-main">
        <header className="ask-topbar">
          <input
            className="ask-search"
            placeholder="Sorularda ara veya yeni bir soru sor..."
            aria-label="Soru arama"
          />
          <div className="ask-topbar__actions">
            <button type="button" className="ask-top-icon" aria-label="Bildirimler">
              🔔
            </button>
            <span className="ask-avatar" aria-hidden="true">
              G
            </span>
          </div>
        </header>

        <div className="ask-main-content">
          <section className="ask-form-card">
            <div className="ask-form-card__header">
              <h1>Soru Sor</h1>
              <p>Sorunu net bir başlıkla yaz, doğru kategoriyle hızlı cevap al.</p>
            </div>

            {askStatus === 'success' ? (
              <div className="ask-success" role="alert">
                <span className="ask-success__icon" aria-hidden="true">
                  ✓
                </span>
                <h2>Sorunuz alındı</h2>
                <p>Sorunuz incelendikten sonra yayınlanacak. Teşekkür ederiz.</p>
                <div className="ask-actions">
                  <button className="ask-btn ask-btn--primary" onClick={resetForm}>
                    Yeni Soru Sor
                  </button>
                  <Link to="/home" className="ask-btn ask-btn--ghost">
                    Ana Sayfaya Dön
                  </Link>
                </div>
              </div>
            ) : (
              <form className="ask-form" onSubmit={handleSubmit} noValidate>
                <div className="ask-field">
                  <label className="ask-field__label" htmlFor="ask-title">
                    Soru başlığı <span aria-hidden="true">*</span>
                  </label>
                  <div className="ask-field__input-wrap">
                    <input
                      id="ask-title"
                      className="ask-field__input"
                      type="text"
                      placeholder="Sorunuzu kısaca özetleyin..."
                      value={askTitle}
                      onChange={(e) => {
                        setAskTitle(e.target.value)
                        if (askStatus === 'error') setAskStatus('idle')
                      }}
                      maxLength={120}
                      disabled={askStatus === 'submitting'}
                    />
                    <span className="ask-field__counter">{askTitle.length}/120</span>
                  </div>
                </div>

                <div className="ask-field">
                  <label className="ask-field__label" htmlFor="ask-category">
                    Kategori <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="ask-category"
                    className="ask-field__select"
                    value={askCategory}
                    onChange={(e) => {
                      setAskCategory(e.target.value)
                      if (askStatus === 'error') setAskStatus('idle')
                    }}
                    disabled={askStatus === 'submitting'}
                  >
                    <option value="" disabled>
                      Bir kategori seçin...
                    </option>
                    {QUESTION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ask-field">
                  <label className="ask-field__label" htmlFor="ask-body">
                    Detaylar <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="ask-body"
                    className="ask-field__textarea"
                    placeholder="Sorunuzu detaylandırın, ne denediğinizi belirtin..."
                    rows={8}
                    value={askBody}
                    onChange={(e) => {
                      setAskBody(e.target.value)
                      if (askStatus === 'error') setAskStatus('idle')
                    }}
                    disabled={askStatus === 'submitting'}
                  />
                </div>

                {askStatus === 'error' ? (
                  <p className="ask-error" role="alert">
                    Lütfen tüm alanları doldurun.
                  </p>
                ) : null}

                <div className="ask-actions">
                  <Link to="/home" className="ask-btn ask-btn--ghost">
                    İptal
                  </Link>
                  <button
                    type="submit"
                    className="ask-btn ask-btn--primary"
                    disabled={askStatus === 'submitting'}
                  >
                    {askStatus === 'submitting' ? 'Gönderiliyor...' : 'Soruyu Gönder'}
                  </button>
                </div>
              </form>
            )}
          </section>

          <aside className="ask-sidepanel">
            <section className="ask-widget">
              <h2>İpucu</h2>
              <ul>
                <li>Sorunu kısa ve net bir başlıkla yaz.</li>
                <li>Hangi adımları denediğini ekle.</li>
                <li>Kategori seçimi doğru olursa görünürlük artar.</li>
              </ul>
            </section>
            <section className="ask-widget">
              <h2>Örnek Kategoriler</h2>
              <div className="ask-tags">
                {QUESTION_CATEGORIES.map((category) => (
                  <span key={category}>{category}</span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
