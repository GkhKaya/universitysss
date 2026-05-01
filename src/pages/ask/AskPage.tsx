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
    <main className="ask-page">
      <div className="ask-page__inner">

        {/* Breadcrumb */}
        <nav className="ask-page__breadcrumb" aria-label="Gezinti yolu">
          <Link to="/" className="ask-page__breadcrumb-link">Ana Sayfa</Link>
          <span className="ask-page__breadcrumb-sep" aria-hidden="true">›</span>
          <span className="ask-page__breadcrumb-current">Soru Sor</span>
        </nav>

        {/* Başlık */}
        <div className="ask-page__header">
          <span className="ask-page__eyebrow">Topluluğa Sor</span>
          <h1 className="ask-page__title">Aklında bir soru mu var?</h1>
          <p className="ask-page__subtitle">
            Sorunuzu akademik topluluğumuzla paylaşın, birlikte cevap bulalım.
          </p>
        </div>

        {/* İpucu kartları */}
        <div className="ask-page__tips">
          {[
            { icon: '🎯', text: 'Soruyu kısa ve net bir başlıkla özetleyin.' },
            { icon: '📋', text: 'Detaylar kısmında ne denediğinizi belirtin.' },
            { icon: '🏷️', text: 'Doğru kategoriyi seçerek daha hızlı cevap alın.' },
          ].map((tip) => (
            <div className="ask-page__tip" key={tip.text}>
              <span className="ask-page__tip-icon" aria-hidden="true">{tip.icon}</span>
              <span className="ask-page__tip-text">{tip.text}</span>
            </div>
          ))}
        </div>

        {/* Form / Başarı */}
        {askStatus === 'success' ? (
          <div className="ask-page__success" role="alert">
            <span className="ask-page__success-icon" aria-hidden="true">✓</span>
            <h2 className="ask-page__success-title">Sorunuz alındı!</h2>
            <p className="ask-page__success-desc">
              Sorunuz incelendikten sonra yayınlanacak. Teşekkür ederiz.
            </p>
            <div className="ask-page__success-actions">
              <button className="ask-btn ask-btn--primary" onClick={resetForm}>
                Yeni Soru Sor
              </button>
              <Link to="/" className="ask-btn ask-btn--ghost">
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        ) : (
          <form className="ask-page__form" onSubmit={handleSubmit} noValidate>

            {/* Başlık */}
            <div className="ask-field">
              <label className="ask-field__label" htmlFor="ask-title">
                Soru başlığı
                <span className="ask-field__required" aria-hidden="true"> *</span>
              </label>
              <div className="ask-field__input-wrap">
                <input
                  id="ask-title"
                  className="ask-field__input"
                  type="text"
                  placeholder="Sorunuzu kısaca özetleyin…"
                  value={askTitle}
                  onChange={(e) => {
                    setAskTitle(e.target.value)
                    if (askStatus === 'error') setAskStatus('idle')
                  }}
                  maxLength={120}
                  disabled={askStatus === 'submitting'}
                  aria-describedby="ask-title-hint"
                />
                <span className="ask-field__counter" aria-live="polite">
                  {askTitle.length}/120
                </span>
              </div>
              <span id="ask-title-hint" className="ask-field__hint">
                Başlık ne kadar net olursa o kadar hızlı cevap alırsınız.
              </span>
            </div>

            {/* Kategori */}
            <div className="ask-field">
              <label className="ask-field__label" htmlFor="ask-category">
                Kategori
                <span className="ask-field__required" aria-hidden="true"> *</span>
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
                <option value="" disabled>Bir kategori seçin…</option>
                {QUESTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Detay */}
            <div className="ask-field">
              <label className="ask-field__label" htmlFor="ask-body">
                Detaylar
                <span className="ask-field__required" aria-hidden="true"> *</span>
              </label>
              <textarea
                id="ask-body"
                className="ask-field__textarea"
                placeholder="Sorunuzu detaylandırın; ne denediğinizi veya nerede takıldığınızı belirtin…"
                rows={7}
                value={askBody}
                onChange={(e) => {
                  setAskBody(e.target.value)
                  if (askStatus === 'error') setAskStatus('idle')
                }}
                disabled={askStatus === 'submitting'}
              />
            </div>

            {/* Hata */}
            {askStatus === 'error' && (
              <p className="ask-page__error" role="alert">
                Lütfen tüm alanları doldurun.
              </p>
            )}

            {/* Aksiyonlar */}
            <div className="ask-page__actions">
              <Link to="/" className="ask-btn ask-btn--ghost">
                İptal
              </Link>
              <button
                type="submit"
                className="ask-btn ask-btn--primary"
                disabled={askStatus === 'submitting'}
              >
                {askStatus === 'submitting' ? (
                  <>
                    <span className="ask-spinner" aria-hidden="true" />
                    Gönderiliyor…
                  </>
                ) : (
                  'Soruyu Gönder'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
