import type { ReactNode } from 'react'
import './FormField.css'

type FormFieldProps = {
  id: string
  label: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  endSlot?: ReactNode
}

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  endSlot,
}: FormFieldProps) {
  return (
    <div className={`form-field${endSlot ? ' form-field--with-end' : ''}`}>
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="form-field__control">
        <input
          id={id}
          className="form-field__input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        {endSlot ? <span className="form-field__end">{endSlot}</span> : null}
      </div>
    </div>
  )
}
