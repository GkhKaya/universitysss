import { Link } from 'react-router-dom'
import './HomePage.css'

interface FeedItem {
  id: string
  title: string
  excerpt: string
  tag: string
  category: string
  timeAgo: string
  answers: number
  likes: number
  author: string
  verified?: boolean
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: 'post-1',
    title: 'Staj başvuruları ne zaman başlıyor?',
    excerpt:
      '2024-2025 Eğitim-Öğretim yılı yaz dönemi zorunlu staj başvuruları 15 Mayıs’ta başlıyor, 15 Haziran’da sona erecek. Başvurular Öğrenci İşleri Bilgi Sistemi üzerinden online olarak yapılmalıdır.',
    tag: 'Resmi Duyuru',
    category: 'STAJ',
    timeAgo: '2 saat önce',
    answers: 8,
    likes: 42,
    author: 'Öğrenci İşleri',
    verified: true,
  },
  {
    id: 'post-2',
    title: 'Yemekhane menüsüne nereden ulaşabilirim? Haftalık liste yayınlanıyor mu?',
    excerpt:
      'Sağlık Kültür ve Spor Daire Başkanlığı sayfasında aylık menüler yayınlanıyor ancak bazen günlük değişiklikler olabiliyor. Üniversitenin mobil uygulamasındaki yemek kartını da takip etmenizi öneririm.',
    tag: 'Kampüs Bilgisi',
    category: 'YEMEKHANE',
    timeAgo: '5 saat önce',
    answers: 3,
    likes: 15,
    author: 'Ahmet K.',
  },
]

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
          <button className="home-nav-item" type="button">
            Sorularım
          </button>
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
          />
          <div className="home-topbar__actions">
            <button type="button" className="home-top-icon" aria-label="Bildirimler">
              🔔
            </button>
            <span className="home-avatar" aria-hidden="true">
              G
            </span>
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

            <div className="home-feed__list">
              {FEED_ITEMS.map((item) => (
                <article key={item.id} className="home-post-card">
                  <div className="home-post-card__meta">
                    <span className="home-tag">
                      {item.verified ? 'Onaylı • ' : ''}
                      {item.tag}
                    </span>
                    <span>{item.timeAgo}</span>
                  </div>

                  <h2>{item.title}</h2>
                  <p>{item.excerpt}</p>

                  <div className="home-post-card__chips">
                    <span>{item.category}</span>
                    <span>Kariyer Merkezi</span>
                  </div>

                  <div className="home-post-card__footer">
                    <div className="home-post-card__stats">
                      <span>👍 {item.likes}</span>
                      <span>💬 {item.answers} Yanıt</span>
                    </div>
                    <span className="home-post-card__author">{item.author}</span>
                  </div>
                </article>
              ))}
            </div>
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
