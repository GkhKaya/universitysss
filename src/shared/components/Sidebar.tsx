import { Link, NavLink } from 'react-router-dom'
import { useCanAccessQuestionApprovals, useIsPlatformAdmin } from '../auth'
import '../../pages/home/HomePage.css'

export function Sidebar({ children }: { children?: React.ReactNode }) {
  const canOpenApprovals = useCanAccessQuestionApprovals()
  const { isAdmin } = useIsPlatformAdmin()

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `home-nav-item ${isActive ? 'home-nav-item--active' : ''}`

  return (
    <aside className="home-sidebar">
      <nav className="home-sidebar__menu" aria-label="Ana menü">
        <NavLink to="/home" className={navClass}>
          Ana Sayfa
        </NavLink>
        <button className="home-nav-item" type="button">
          Kategoriler
        </button>
        <NavLink to="/faq" className={navClass}>
          Sıkça Sorulan Sorular
        </NavLink>
        <NavLink to="/my-questions" className={navClass}>
          Sorularım
        </NavLink>
        <NavLink to="/answer-questions" className={navClass}>
          Soru Cevaplama
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={navClass}>
            Yönetim Paneli
          </NavLink>
        )}
        {canOpenApprovals && !isAdmin && (
          <NavLink to="/question-approvals" className={navClass}>
            Onay Bekleyen Sorular
          </NavLink>
        )}
      </nav>

      {children}

      <Link to="/ask" className="home-ask-button">
        + Soru Sor
      </Link>
    </aside>
  )
}
