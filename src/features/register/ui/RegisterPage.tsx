import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '../../../shared/locale'
import { useRegisterViewModel } from '../hooks/useRegisterViewModel'
import { RegisterForm } from './RegisterForm'
import { RegisterHeroPanel } from './RegisterHeroPanel'
import './RegisterPage.css'

export function RegisterPage() {
  const { messages } = useLocale()
  const r = messages.register
  const navigate = useNavigate()

  const vm = useRegisterViewModel(r)

  useEffect(() => {
    if (vm.status.kind === 'success') {
      const timer = window.setTimeout(() => navigate('/'), 1400)
      return () => window.clearTimeout(timer)
    }
  }, [vm.status, navigate])

  return (
    <div className="register-page">
      <main className="register-page__main">
        <RegisterHeroPanel
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
