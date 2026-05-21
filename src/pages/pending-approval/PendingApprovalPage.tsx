import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/auth'
import './PendingApprovalPage.css'

export function PendingApprovalPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="pending-approval-page">
      <div className="pending-approval-card">
        <div className="pending-icon-wrapper">
          <svg 
            className="pending-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        
        <h1 className="pending-title">Onay Bekleniyor</h1>
        
        <p className="pending-description">
          Hesabınız başarıyla oluşturuldu ancak sisteme giriş yapabilmeniz için yönetici onayı gerekmektedir. 
          Hesabınız onaylandığında bilgilendirileceksiniz.
        </p>
        
        <button className="pending-logout-btn" onClick={handleLogout}>
          Farklı Bir Hesapla Giriş Yap
        </button>
      </div>
    </div>
  )
}
