import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { LoginMessages } from '../../../../shared/locale/types'
import { FormField } from '../../ui/FormField'
import { IconVisibility, IconVisibilityOff } from '../../ui/AuthIcons'
import { LocaleSwitcher } from '../../ui/LocaleSwitcher'
import type { LoginFormStatus } from '../hooks/useLoginViewModel'
import '../../ui/auth-form.css'

export type LoginFormViewProps = {
  strings: LoginMessages
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  showPassword: boolean
  setShowPassword: (v: boolean) => void
  status: LoginFormStatus
  onSubmit: (e: FormEvent) => void
}

export function LoginForm(props: LoginFormViewProps) {
  const { strings, status, onSubmit } = props

  return (
    <section className="auth-form-section">
      <div className="auth-form-section__inner">
        <header className="auth-form-section__header">
          <div className="auth-form-section__header-row">
            <LocaleSwitcher label={strings.localeSwitchLabel} />
          </div>
          <h1 className="auth-form-section__title">{strings.formTitle}</h1>
          <p className="auth-form-section__lead">{strings.formSubtitle}</p>
        </header>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="auth-form__fields">
            <FormField
              id="login-email"
              label={strings.emailLabel}
              type="email"
              value={props.email}
              onChange={props.setEmail}
              placeholder={strings.emailPlaceholder}
              autoComplete="email"
            />
            <div className="auth-form__password">
              <FormField
                id="login-password"
                label={strings.passwordLabel}
                type={props.showPassword ? 'text' : 'password'}
                value={props.password}
                onChange={props.setPassword}
                placeholder={strings.passwordPlaceholder}
                autoComplete="current-password"
                endSlot={
                  <button
                    type="button"
                    className="form-field__end-button"
                    onClick={() => props.setShowPassword(!props.showPassword)}
                    aria-label={
                      props.showPassword ? strings.passwordHideAria : strings.passwordShowAria
                    }
                  >
                    {props.showPassword ? <IconVisibilityOff /> : <IconVisibility />}
                  </button>
                }
              />
            </div>
          </div>

          {status.kind === 'error' ? (
            <p className="auth-form__feedback auth-form__feedback--error" role="alert">
              {status.message}
            </p>
          ) : null}
          {status.kind === 'success' ? (
            <p className="auth-form__feedback auth-form__feedback--ok" role="status">
              {status.message}
            </p>
          ) : null}

          <button
            className="auth-form__submit"
            type="submit"
            disabled={status.kind === 'submitting'}
          >
            {status.kind === 'submitting' ? strings.submitLoading : strings.submitButton}
          </button>

          <p className="auth-form__footer">
            {strings.footerPrompt}{' '}
            <Link className="auth-form__link auth-form__link--strong" to="/register">
              {strings.registerLink}
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
