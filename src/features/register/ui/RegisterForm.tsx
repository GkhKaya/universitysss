import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { RegisterMessages } from '../../../shared/locale/types'
import type { RegistrationRole } from '../model/types'
import type { RegisterFormStatus } from '../hooks/useRegisterViewModel'
import type { DepartmentOption } from '../model/types'
import { DepartmentField } from './DepartmentField'
import { FormField } from './FormField'
import { IconVisibility, IconVisibilityOff } from './RegisterIcons'
import { LocaleSwitcher } from './LocaleSwitcher'
import { RoleSelector } from './RoleSelector'
import './RegisterForm.css'

export type RegisterFormViewProps = {
  strings: RegisterMessages
  role: RegistrationRole
  setRole: (role: RegistrationRole) => void
  displayName: string
  setDisplayName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  departments: DepartmentOption[]
  departmentsStatus: 'loading' | 'error' | 'ready'
  departmentSearch: string
  setDepartmentSearch: (v: string) => void
  filteredDepartments: DepartmentOption[]
  selectedDepartment: DepartmentOption | null
  onSelectDepartment: (dept: DepartmentOption) => void
  password: string
  setPassword: (v: string) => void
  showPassword: boolean
  setShowPassword: (v: boolean) => void
  status: RegisterFormStatus
  onSubmit: (e: FormEvent) => void
}

export function RegisterForm(props: RegisterFormViewProps) {
  const { strings, status, onSubmit } = props

  return (
    <section className="register-form-section">
      <div className="register-form-section__inner">
        <header className="register-form-section__header">
          <div className="register-form-section__header-row">
            <LocaleSwitcher label={strings.localeSwitchLabel} />
          </div>
          <h1 className="register-form-section__title">{strings.formTitle}</h1>
          <p className="register-form-section__lead">{strings.formSubtitle}</p>
        </header>

        <form className="register-form" onSubmit={onSubmit} noValidate>
          <RoleSelector
            value={props.role}
            onChange={props.setRole}
            strings={{
              roleLabel: strings.roleLabel,
              roleStudent: strings.roleStudent,
              roleTeacher: strings.roleTeacher,
            }}
          />

          <div className="register-form__fields">
            <FormField
              id="register-full-name"
              label={strings.fullNameLabel}
              value={props.displayName}
              onChange={props.setDisplayName}
              placeholder={strings.fullNamePlaceholder}
              autoComplete="name"
            />
            <FormField
              id="register-email"
              label={strings.emailLabel}
              type="email"
              value={props.email}
              onChange={props.setEmail}
              placeholder={strings.emailPlaceholder}
              autoComplete="email"
            />
            <DepartmentField
              id="register-department"
              strings={{
                departmentLabel: strings.departmentLabel,
                departmentPlaceholder: strings.departmentPlaceholder,
                departmentLoading: strings.departmentLoading,
                departmentLoadError: strings.departmentLoadError,
                departmentEmpty: strings.departmentEmpty,
                departmentNoMatch: strings.departmentNoMatch,
              }}
              status={props.departmentsStatus}
              options={props.departments}
              filtered={props.filteredDepartments}
              search={props.departmentSearch}
              onSearchChange={props.setDepartmentSearch}
              selected={props.selectedDepartment}
              onSelect={props.onSelectDepartment}
            />
            <div className="register-form__password">
              <FormField
                id="register-password"
                label={strings.passwordLabel}
                type={props.showPassword ? 'text' : 'password'}
                value={props.password}
                onChange={props.setPassword}
                placeholder={strings.passwordPlaceholder}
                autoComplete="new-password"
                endSlot={
                  <button
                    type="button"
                    className="form-field__end-button"
                    onClick={() => props.setShowPassword(!props.showPassword)}
                    aria-label={
                      props.showPassword ? strings.passwordHideAria : strings.passwordShowAria
                    }
                  >
                    {props.showPassword ? (
                      <IconVisibilityOff />
                    ) : (
                      <IconVisibility />
                    )}
                  </button>
                }
              />
            </div>
          </div>

          {status.kind === 'error' ? (
            <p className="register-form__feedback register-form__feedback--error" role="alert">
              {status.message}
            </p>
          ) : null}
          {status.kind === 'success' ? (
            <p className="register-form__feedback register-form__feedback--ok" role="status">
              {status.message}
            </p>
          ) : null}

          <p className="register-form__terms">
            {strings.termsPrefix}
            <a className="register-form__link" href="#">
              {strings.termsLink}
            </a>
            {strings.termsMiddle}
            <a className="register-form__link" href="#">
              {strings.privacyLink}
            </a>
            {strings.termsSuffix}
          </p>

          <button
            className="register-form__submit"
            type="submit"
            disabled={
              status.kind === 'submitting' ||
              props.departmentsStatus === 'loading' ||
              props.departmentsStatus === 'error'
            }
          >
            {status.kind === 'submitting' ? strings.submitLoading : strings.submitButton}
          </button>

          <p className="register-form__footer">
            {strings.footerPrompt}{' '}
            <Link className="register-form__link register-form__link--strong" to="/">
              {strings.loginLink}
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
