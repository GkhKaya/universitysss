import type { RegisterMessages } from '../../../shared/locale/types'
import type { RegistrationRole } from '../model/types'
import { IconCheckCircle, IconMenuBook, IconSchool } from './RegisterIcons'
import './RoleSelector.css'

type RoleSelectorProps = {
  value: RegistrationRole
  onChange: (role: RegistrationRole) => void
  strings: Pick<RegisterMessages, 'roleLabel' | 'roleStudent' | 'roleTeacher'>
}

export function RoleSelector({ value, onChange, strings }: RoleSelectorProps) {
  return (
    <div className="role-selector">
      <span className="role-selector__label">{strings.roleLabel}</span>
      <div className="role-selector__grid" role="radiogroup" aria-label={strings.roleLabel}>
        <button
          type="button"
          role="radio"
          aria-checked={value === 'student'}
          className={`role-selector__card${value === 'student' ? ' role-selector__card--active' : ''}`}
          onClick={() => onChange('student')}
        >
          <IconSchool className="role-selector__icon" />
          <span className="role-selector__title">{strings.roleStudent}</span>
          {value === 'student' ? (
            <span className="role-selector__check" aria-hidden>
              <IconCheckCircle className="role-selector__check-icon" />
            </span>
          ) : null}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={value === 'teacher'}
          className={`role-selector__card${value === 'teacher' ? ' role-selector__card--active' : ''}`}
          onClick={() => onChange('teacher')}
        >
          <IconMenuBook className="role-selector__icon" />
          <span className="role-selector__title">{strings.roleTeacher}</span>
          {value === 'teacher' ? (
            <span className="role-selector__check" aria-hidden>
              <IconCheckCircle className="role-selector__check-icon" />
            </span>
          ) : null}
        </button>
      </div>
    </div>
  )
}
