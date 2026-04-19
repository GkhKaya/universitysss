import { Link } from 'react-router-dom'
import { useLocale } from '../../shared/locale'
import './HomePage.css'

export function HomePage() {
  const { messages } = useLocale()
  const h = messages.home

  return (
    <main className="home">
      <h1>{h.title}</h1>
      <p>{h.description}</p>
      <p className="home__cta">
        <Link to="/login">{h.loginCta}</Link>
        {' · '}
        <Link to="/register">{h.registerCta}</Link>
      </p>
    </main>
  )
}
