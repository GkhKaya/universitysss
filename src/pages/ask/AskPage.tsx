import { Link } from 'react-router-dom'
import { useAuth } from '../../shared/auth'
import { useLocale } from '../../shared/locale'
import { useTheme } from '../../shared/theme'
import type { QuestionTargetAudience } from '../../shared/types/firestore'
import './AskPage.css'
import { useAskQuestionViewModel } from './hooks/useAskQuestionViewModel'

export function AskPage() {
  const { messages } = useLocale()
  const a = messages.ask
  const vm = useAskQuestionViewModel(a)
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()

  return (
    <main className="ask-dashboard">
      <aside className="ask-sidebar">
        <div className="ask-sidebar__brand">Akademik Avlu</div>
        <nav className="ask-sidebar__menu" aria-label="Ana menü">
          <Link to="/home" className="ask-nav-item">
            {a.menuHome}
          </Link>
          <span className="ask-nav-item">{a.menuCategories}</span>
          <span className="ask-nav-item">{a.menuScholarships}</span>
          <span className="ask-nav-item">{a.menuRegistration}</span>
          <Link to="/my-questions" className="ask-nav-item">{a.menuMyQuestions}</Link>
          <span className="ask-nav-item ask-nav-item--active">{a.menuAsk}</span>
        </nav>
      </aside>

      <section className="ask-main">
        <header className="ask-topbar">
          <input
            className="ask-search"
            placeholder={a.searchPlaceholder}
            aria-label="Soru arama"
          />
          <div className="ask-topbar__actions">
            <button
              type="button"
              className="ask-theme-toggle"
              aria-label="Tema değiştir"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button type="button" className="ask-top-icon" aria-label="Bildirimler">
              🔔
            </button>
            <span className="ask-avatar" aria-hidden="true" title="Profil">
              G
            </span>
            <button
              type="button"
              className="ask-top-icon"
              aria-label="Çıkış yap"
              onClick={logout}
              title="Çıkış yap"
            >
              🚪
            </button>
          </div>
        </header>

        <div className="ask-main-content">
          <section className="ask-form-card">
            <div className="ask-form-card__header">
              <h1>{a.pageTitle}</h1>
              <p>{a.pageSubtitle}</p>
            </div>

            {vm.status.kind === 'success' ? (
              <div className="ask-success" role="alert">
                <span className="ask-success__icon" aria-hidden="true">
                  ✓
                </span>
                <h2>{a.successTitle}</h2>
                <p>{vm.status.message}</p>
                <div className="ask-actions">
                  <button className="ask-btn ask-btn--primary" onClick={vm.resetFeedback}>
                    {a.successPrimaryAction}
                  </button>
                  <Link to="/home" className="ask-btn ask-btn--ghost">
                    {a.successSecondaryAction}
                  </Link>
                </div>
              </div>
            ) : (
              <form
                className="ask-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  void vm.submit()
                }}
                noValidate
              >
                <div className="ask-field">
                  <label className="ask-field__label" htmlFor="ask-title">
                    {a.titleLabel} <span aria-hidden="true">*</span>
                  </label>
                  <div className="ask-field__input-wrap">
                    <input
                      id="ask-title"
                      className="ask-field__input"
                      type="text"
                      placeholder={a.titlePlaceholder}
                      value={vm.title}
                      onChange={(e) => {
                        vm.setTitle(e.target.value)
                        if (vm.status.kind === 'error') {
                          vm.resetFeedback()
                        }
                      }}
                      maxLength={120}
                      disabled={vm.status.kind === 'submitting'}
                    />
                    <span className="ask-field__counter">{vm.title.length}/120</span>
                  </div>
                </div>

                <div className="ask-field">
                  <label className="ask-field__label" htmlFor="ask-category">
                    {a.categoryLabel} <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="ask-category"
                    className="ask-field__select"
                    value={vm.categoryId}
                    onChange={(e) => {
                      vm.setCategoryId(e.target.value)
                      if (vm.status.kind === 'error') {
                        vm.resetFeedback()
                      }
                    }}
                    disabled={vm.status.kind === 'submitting' || vm.categoriesStatus !== 'ready'}
                  >
                    <option value="" disabled>
                      {vm.categoriesStatus === 'loading'
                        ? a.categoryLoading
                        : vm.categoriesStatus === 'error'
                          ? a.categoryLoadError
                          : a.categoryPlaceholder}
                    </option>
                    {vm.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ask-field">
                  <label className="ask-field__label" htmlFor="ask-body">
                    {a.contentLabel} <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="ask-body"
                    className="ask-field__textarea"
                    placeholder={a.contentPlaceholder}
                    rows={8}
                    value={vm.content}
                    onChange={(e) => {
                      vm.setContent(e.target.value)
                      if (vm.status.kind === 'error') {
                        vm.resetFeedback()
                      }
                    }}
                    disabled={vm.status.kind === 'submitting'}
                  />
                </div>

                <div className="ask-field">
                  <label className="ask-field__label" htmlFor="ask-target-audience">
                    {a.targetAudienceLabel}
                  </label>
                  <select
                    id="ask-target-audience"
                    className="ask-field__select"
                    value={vm.targetAudience}
                    onChange={(event) => {
                      vm.setTargetAudience(event.target.value as QuestionTargetAudience)
                      if (vm.status.kind === 'error') {
                        vm.resetFeedback()
                      }
                    }}
                    disabled={vm.status.kind === 'submitting'}
                  >
                    <option value="everyone">{a.targetAudienceEveryone}</option>
                    <option value="to_student">{a.targetAudienceToStudent}</option>
                    <option value="to_teacher">{a.targetAudienceToTeacher}</option>
                  </select>
                </div>

                <label className="ask-checkbox">
                  <input
                    type="checkbox"
                    checked={vm.isAnonymous}
                    onChange={(event) => {
                      vm.setIsAnonymous(event.target.checked)
                      if (vm.status.kind === 'error') {
                        vm.resetFeedback()
                      }
                    }}
                    disabled={vm.status.kind === 'submitting'}
                  />
                  <span>{a.anonymousLabel}</span>
                </label>

                {vm.status.kind === 'error' ? (
                  <p className="ask-error" role="alert">
                    {vm.status.message}
                  </p>
                ) : null}

                <div className="ask-actions">
                  <Link to="/home" className="ask-btn ask-btn--ghost">
                    {a.cancelButton}
                  </Link>
                  <button
                    type="submit"
                    className="ask-btn ask-btn--primary"
                    disabled={vm.status.kind === 'submitting'}
                  >
                    {vm.status.kind === 'submitting' ? a.submitLoading : a.submitButton}
                  </button>
                </div>
              </form>
            )}
          </section>

          <aside className="ask-sidepanel">
            <section className="ask-widget">
              <h2>{a.tipsTitle}</h2>
              <ul>
                {a.tipsItems.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>
            <section className="ask-widget">
              <h2>{a.sampleCategoriesTitle}</h2>
              <div className="ask-tags">
                {vm.categories.map((category) => (
                  <span key={category.id}>{category.name}</span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
