import { useCallback, useId, useRef, useState } from 'react'
import type { RegisterMessages } from '../../../shared/locale/types'
import type { DepartmentOption } from '../model/types'
import { IconSearch } from './RegisterIcons'
import './DepartmentField.css'

export type { DepartmentOption } from '../model/types'

type DepartmentFieldProps = {
  id: string
  strings: Pick<
    RegisterMessages,
    | 'departmentLabel'
    | 'departmentPlaceholder'
    | 'departmentLoading'
    | 'departmentLoadError'
    | 'departmentEmpty'
    | 'departmentNoMatch'
  >
  status: 'loading' | 'error' | 'ready'
  options: DepartmentOption[]
  filtered: DepartmentOption[]
  search: string
  onSearchChange: (value: string) => void
  selected: DepartmentOption | null
  onSelect: (dept: DepartmentOption) => void
}

export function DepartmentField({
  id,
  strings,
  status,
  options,
  filtered,
  search,
  onSearchChange,
  selected,
  onSelect,
}: DepartmentFieldProps) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showList = open && status === 'ready' && options.length > 0

  const clearBlurTimer = useCallback(() => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current)
      blurTimer.current = null
    }
  }, [])

  const handleFocus = () => {
    clearBlurTimer()
    setOpen(true)
  }

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 120)
  }

  const handleSelect = (dept: DepartmentOption) => {
    clearBlurTimer()
    onSelect(dept)
    setOpen(false)
  }

  return (
    <div className="department-field">
      <label className="department-field__label" htmlFor={id}>
        {strings.departmentLabel}
      </label>
      <div className="department-field__wrap">
        <div className="department-field__control">
          <input
            id={id}
            className="department-field__input"
            type="text"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            value={search}
            placeholder={strings.departmentPlaceholder}
            disabled={status === 'loading' || status === 'error'}
            onChange={(e) => {
              onSearchChange(e.target.value)
              setOpen(true)
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span className="department-field__icon" aria-hidden>
            <IconSearch />
          </span>
        </div>

        {status === 'loading' ? (
          <p className="department-field__hint">{strings.departmentLoading}</p>
        ) : null}
        {status === 'error' ? (
          <p className="department-field__hint department-field__hint--error" role="alert">
            {strings.departmentLoadError}
          </p>
        ) : null}
        {status === 'ready' && options.length === 0 ? (
          <p className="department-field__hint">{strings.departmentEmpty}</p>
        ) : null}

        {showList ? (
          <ul
            id={listId}
            className="department-field__list"
            role="listbox"
            onMouseDown={(e) => e.preventDefault()}
          >
            {filtered.length === 0 ? (
              <li className="department-field__item department-field__item--muted">
                {strings.departmentNoMatch}
              </li>
            ) : (
              filtered.map((dept) => (
                <li key={dept.id} role="none">
                  <button
                    type="button"
                    role="option"
                    className={`department-field__option${selected?.id === dept.id ? ' department-field__option--active' : ''}`}
                    onClick={() => handleSelect(dept)}
                  >
                    {dept.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
