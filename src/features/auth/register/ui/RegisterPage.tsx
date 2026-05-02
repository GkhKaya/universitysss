import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '../../../../shared/locale'
import { AuthHeroPanel } from '../../ui/AuthHeroPanel'
import '../../ui/AuthPage.css'
import { useRegisterViewModel } from '../hooks/useRegisterViewModel'
import { RegisterForm } from './RegisterForm'

export function RegisterPage() {
  const { messages } = useLocale()
  const r = messages.register
  const navigate = useNavigate()

  const vm = useRegisterViewModel(r)

  useEffect(() => {
    if (vm.status.kind === 'success') {
      const timer = window.setTimeout(() => navigate('/login'), 1400)
      return () => window.clearTimeout(timer)
    }
  }, [vm.status, navigate])

  return (
    <div className="auth-page">
      <main className="auth-page__main">
        <AuthHeroPanel
          strings={{
            heroTitle: r.heroTitle,
            heroSubtitle: r.heroSubtitle,
            heroImageAlt: r.heroImageAlt,
          }}
        />
        <RegisterForm
          strings={r}
          role={vm.role}
          setRole={vm.setRole}
          displayName={vm.displayName}
          setDisplayName={vm.setDisplayName}
          email={vm.email}
          setEmail={vm.setEmail}
          departments={vm.departments}
          departmentsStatus={vm.departmentsStatus}
          departmentSearch={vm.departmentSearch}
          setDepartmentSearch={vm.setDepartmentSearch}
          filteredDepartments={vm.filteredDepartments}
          selectedDepartment={vm.selectedDepartment}
          onSelectDepartment={vm.setSelectedDepartment}
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
