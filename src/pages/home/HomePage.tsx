import { useState } from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Kayıt & Hesap',
    question: 'Platforma nasıl kayıt olabilirim?',
    answer:
      'Kayıt olmak için sağ üstteki "Kayıt Ol" butonuna tıklayın. Üniversite e-posta adresinizi (öğrenciler için @ogr.dpu.edu.tr, öğretmenler için @dpu.edu.tr), adınızı, bölümünüzü ve şifrenizi girerek hesabınızı oluşturabilirsiniz.',
  },
  {
    id: 'faq-2',
    category: 'Kayıt & Hesap',
    question: 'Hangi e-posta adresiyle kayıt olabilirim?',
    answer:
      'Yalnızca Dumlupınar Üniversitesi kurumsal e-posta adresleriyle kayıt yapılabilmektedir. Öğrenciler @ogr.dpu.edu.tr, öğretmenler ise @dpu.edu.tr uzantılı adreslerini kullanmalıdır.',
  },
  {
    id: 'faq-3',
    category: 'Sorular & Cevaplar',
    question: 'Soru nasıl sorabilirim?',
    answer:
      'Hesabınıza giriş yaptıktan sonra "Soru Sor" butonuna tıklayarak yeni bir soru oluşturabilirsiniz. Sorunuzu ilgili kategoriye atayabilir, detaylı açıklama ekleyebilirsiniz.',
  },
  {
    id: 'faq-4',
    category: 'Sorular & Cevaplar',
    question: 'Başkalarının sorularını görebilir miyim?',
    answer:
      'Evet, platformdaki tüm soruları giriş yapmadan da görüntüleyebilirsiniz. Ancak cevap vermek veya yorum yapmak için hesap oluşturmanız gerekmektedir.',
  },
  {
    id: 'faq-5',
    category: 'Sorular & Cevaplar',
    question: 'En faydalı cevabı nasıl seçebilirim?',
    answer:
      'Soruyu soran kişi, verilen cevaplar arasından en doğru bulduğunu "kabul edildi" olarak işaretleyebilir. Bu sayede diğer kullanıcılar en doğru cevabı kolayca bulabilir.',
  },
  {
    id: 'faq-6',
    category: 'Platform & Kullanım',
    question: 'Platform hangi dilleri destekliyor?',
    answer:
      'Platform şu anda Türkçe ve İngilizce dillerini desteklemektedir. Dil tercihini ekranın sağ üst köşesindeki dil seçicisinden değiştirebilirsiniz.',
  },
  {
    id: 'faq-7',
    category: 'Platform & Kullanım',
    question: 'Yanlış veya uygunsuz içerikleri nasıl bildirebilirim?',
    answer:
      'Her soru ve cevabın yanında bulunan "Bildir" butonuna tıklayarak uygunsuz içerikleri yöneticilere bildirebilirsiniz. Ekibimiz bildirimleri en kısa sürede inceleyecektir.',
  },
]

const CATEGORIES = [...new Set(FAQ_ITEMS.map((f) => f.category))]

export function HomePage() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('Tümü')

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const filtered =
    activeCategory === 'Tümü'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((f) => f.category === activeCategory)

  return (
    <main className="home-page">
      {/* ── Hero ────────────────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero__badge">Dumlupınar Üniversitesi</div>
        <h1 className="home-hero__title">
          Aklındaki soruların
          <br />
          <span className="home-hero__accent">cevapları burada.</span>
        </h1>
        <p className="home-hero__subtitle">
          Üniversite yaşamına dair merak ettiklerini sor, öğret, paylaş.
          Akademik topluluğun gücünden yararlan.
        </p>
        <div className="home-hero__actions">
          <Link to="/register" className="home-btn home-btn--primary">
            Hemen Katıl
          </Link>
          <Link to="/ask" className="home-btn home-btn--ghost">
            Soru Sor →
          </Link>
        </div>

        {/* Stats */}
        <div className="home-stats">
          <div className="home-stats__item">
            <span className="home-stats__value">500+</span>
            <span className="home-stats__label">Soru</span>
          </div>
          <div className="home-stats__divider" aria-hidden="true" />
          <div className="home-stats__item">
            <span className="home-stats__value">1.200+</span>
            <span className="home-stats__label">Cevap</span>
          </div>
          <div className="home-stats__divider" aria-hidden="true" />
          <div className="home-stats__item">
            <span className="home-stats__value">300+</span>
            <span className="home-stats__label">Üye</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section className="home-faq" id="faq">
        <div className="home-faq__header">
          <h2 className="home-faq__title">Sıkça Sorulan Sorular</h2>
          <p className="home-faq__subtitle">
            Platformu kullanmadan önce merak ettiklerinize göz atın.
          </p>
        </div>

        {/* Category filter pills */}
        <div className="home-faq__filters" role="group" aria-label="Kategori filtresi">
          {['Tümü', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              className={`home-faq__pill${activeCategory === cat ? ' home-faq__pill--active' : ''}`}
              onClick={() => {
                setActiveCategory(cat)
                setOpenId(null)
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion list */}
        <div className="home-faq__list">
          {filtered.map((item) => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                className={`home-faq__item${isOpen ? ' home-faq__item--open' : ''}`}
              >
                <button
                  id={`${item.id}-btn`}
                  className="home-faq__question"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-answer`}
                  onClick={() => toggle(item.id)}
                >
                  <span className="home-faq__question-text">{item.question}</span>
                  <span className="home-faq__chevron" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  id={`${item.id}-answer`}
                  role="region"
                  aria-labelledby={`${item.id}-btn`}
                  className="home-faq__answer-wrapper"
                  hidden={!isOpen}
                >
                  <p className="home-faq__answer">{item.answer}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Alt link — soru sor */}
        <div className="home-faq__footer">
          <p className="home-faq__footer-text">
            Aradığını bulamadın mı?
          </p>
          <Link to="/ask" className="home-btn home-btn--primary">
            Soru Sor
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────── */}
      <section className="home-cta">
        <div className="home-cta__inner">
          <h2 className="home-cta__title">Topluluğa katılmaya hazır mısın?</h2>
          <p className="home-cta__desc">
            Üniversite e-posta adresinle birkaç saniyede hesap oluştur.
          </p>
          <Link to="/register" className="home-btn home-btn--primary home-btn--lg">
            Kayıt Ol
          </Link>
        </div>
      </section>
    </main>
  )
}
