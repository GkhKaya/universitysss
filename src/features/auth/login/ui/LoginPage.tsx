import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '../../../../shared/locale'
import { AuthHeroPanel } from '../../ui/AuthHeroPanel'
import '../../ui/AuthPage.css'
import { useLoginViewModel } from '../hooks/useLoginViewModel'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  const { messages } = useLocale()
  const l = messages.login
  const navigate = useNavigate()

  const vm = useLoginViewModel(l)

  useEffect(() => {
    if (vm.status.kind === 'success') {
      const timer = window.setTimeout(() => navigate('/home'), 1400)
      return () => window.clearTimeout(timer)
    }
  }, [vm.status, navigate])

  return (
    <div className="auth-page">
      <main className="auth-page__main">
        <AuthHeroPanel
          strings={{
            heroTitle: l.heroTitle,
            heroSubtitle: l.heroSubtitle,
            heroImageAlt: l.heroImageAlt,
          }}
        />
        <LoginForm
          strings={l}
          email={vm.email}
          setEmail={vm.setEmail}
          password={vm.password}
          setPassword={vm.setPassword}
          showPassword={vm.showPassword}
          setShowPassword={vm.setShowPassword}
          status={vm.status}
          onSubmit={(e) => {
            e.preventDefault()
            void vm.submit()
          }}
        />
      </main>
    </div>
  )
}
