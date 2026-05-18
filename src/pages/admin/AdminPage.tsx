import { Link } from 'react-router-dom'
import { useAuth } from '../../shared/auth'
import { useTheme } from '../../shared/theme'
import { Sidebar } from '../../shared/components/Sidebar'
import { useAdminViewModel, type AdminTab } from './hooks/useAdminViewModel'
import './AdminPage.css'

function formatDate(ts: { toDate?: () => Date } | null | undefined): string {
  if (!ts || typeof ts.toDate !== 'function') return ''
  return ts.toDate().toLocaleString('tr-TR')
}

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'questions', label: 'Sorular' },
  { id: 'users', label: 'Kullanıcılar' },
  { id: 'categories', label: 'Kategoriler' },
  { id: 'departments', label: 'Bölümler' },
]

export function AdminPage() {
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const vm = useAdminViewModel()

  return (
    <main className="adm-dashboard">
      <Sidebar />

      <section className="adm-main">
        <header className="adm-topbar">
          <h1>Yönetim Paneli</h1>
          <div className="adm-topbar__actions">
            <button
              type="button"
              className="adm-top-icon"
              aria-label="Tema değiştir"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button type="button" className="adm-top-icon" aria-label="Çıkış yap" onClick={logout}>
              🚪
            </button>
          </div>
        </header>

        <p className="adm-subtitle">Soru onayı, kullanıcı, kategori ve bölüm yönetimi</p>

        {vm.feedback ? <p className="adm-feedback">{vm.feedback}</p> : null}

        {vm.status === 'forbidden' ? (
          <div className="adm-empty">
            <h2>Erişim reddedildi</h2>
            <p>Bu sayfa yalnızca platform yöneticileri içindir.</p>
            <Link to="/home" className="adm-btn adm-btn--secondary">
              Ana sayfaya dön
            </Link>
          </div>
        ) : null}

        {vm.status === 'error' ? (
          <p className="adm-state">Veriler yüklenemedi. Sayfayı yenileyin.</p>
        ) : null}

        {vm.status === 'loading' ? <p className="adm-state">Yükleniyor…</p> : null}

        {vm.status === 'ready' ? (
          <>
            <nav className="adm-tabs" aria-label="Yönetim sekmeleri">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`adm-tab ${vm.tab === t.id ? 'adm-tab--active' : ''}`}
                  onClick={() => {
                    vm.setTab(t.id)
                  }}
                >
                  {t.label}
                  {t.id === 'questions' && vm.pendingQuestions.length > 0
                    ? ` (${vm.pendingQuestions.length})`
                    : null}
                  {t.id === 'users' && vm.pendingUsers.length > 0
                    ? ` (${vm.pendingUsers.length})`
                    : null}
                </button>
              ))}
            </nav>

            {vm.tab === 'questions' ? (
              <section className="adm-section">
                <div className="adm-section__toolbar">
                  <label className="adm-toggle">
                    <input
                      type="checkbox"
                      checked={vm.showAllQuestions}
                      onChange={(e) => {
                        vm.setShowAllQuestions(e.target.checked)
                      }}
                    />
                    Tüm soruları göster
                  </label>
                </div>
                {vm.questionList.length === 0 ? (
                  <p className="adm-state">Liste boş.</p>
                ) : (
                  <div className="adm-list">
                    {vm.questionList.map((q) => (
                      <article key={q.id} className="adm-card">
                        <div className="adm-card__header">
                          <h2>{q.title}</h2>
                          <div className="adm-card__actions">
                            {!q.isApproved ? (
                              <button
                                type="button"
                                className="adm-btn adm-btn--primary"
                                disabled={vm.busyId === q.id}
                                onClick={() => {
                                  void vm.approveQuestion(q.id)
                                }}
                              >
                                Onayla
                              </button>
                            ) : (
                              <span className="adm-badge adm-badge--ok">Onaylı</span>
                            )}
                            <button
                              type="button"
                              className="adm-btn adm-btn--danger"
                              disabled={vm.busyId === q.id}
                              onClick={() => {
                                vm.deleteQuestion(q.id)
                              }}
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <p className="adm-card__excerpt">{q.content}</p>
                        <div className="adm-card__meta">
                          <span>{q.categoryName}</span>
                          <span>{q.authorName}</span>
                          <span>{formatDate(q.createdAt)}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            ) : null}

            {vm.tab === 'users' ? (
              <section className="adm-section">
                {vm.users.length === 0 ? (
                  <p className="adm-state">Kullanıcı bulunamadı.</p>
                ) : (
                  <div className="adm-table-wrap">
                    <table className="adm-table">
                      <thead>
                        <tr>
                          <th>Ad</th>
                          <th>E-posta</th>
                          <th>Roller</th>
                          <th>Bölüm</th>
                          <th>Durum</th>
                          <th>İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vm.users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.displayName}</td>
                            <td>{u.email}</td>
                            <td>
                              <div className="adm-roles-cell">
                                {u.roles.map((role) => (
                                  <span key={role.id} className="adm-role-chip">
                                    {role.label}
                                    <button
                                      type="button"
                                      className="adm-role-chip__remove"
                                      aria-label={`${role.label} rolünü kaldır`}
                                      disabled={vm.busyId === `${u.id}-rm-${role.id}`}
                                      onClick={() => {
                                        vm.removeUserRole(u.id, role.id)
                                      }}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                                <div className="adm-role-add">
                                  <select
                                    className="adm-select"
                                    value={vm.roleToAddByUser[u.id] ?? ''}
                                    onChange={(e) => {
                                      vm.setRoleToAdd(u.id, e.target.value)
                                    }}
                                  >
                                    <option value="">Rol ekle…</option>
                                    {vm.availableRoles
                                      .filter((r) => !u.roles.some((ur) => ur.id === r.id))
                                      .map((r) => (
                                        <option key={r.id} value={r.id}>
                                          {r.label}
                                        </option>
                                      ))}
                                  </select>
                                  <button
                                    type="button"
                                    className="adm-btn adm-btn--primary adm-btn--sm"
                                    disabled={
                                      !vm.roleToAddByUser[u.id]
                                      || vm.busyId === `${u.id}-add-${vm.roleToAddByUser[u.id]}`
                                    }
                                    onClick={() => {
                                      vm.addUserRole(u.id)
                                    }}
                                  >
                                    Ekle
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td>{u.departmentName}</td>
                            <td>
                              {u.isApproved ? (
                                <span className="adm-badge adm-badge--ok">Onaylı</span>
                              ) : (
                                <span className="adm-badge adm-badge--pending">Bekliyor</span>
                              )}
                            </td>
                            <td className="adm-table__actions">
                              {!u.isApproved ? (
                                <button
                                  type="button"
                                  className="adm-btn adm-btn--primary adm-btn--sm"
                                  disabled={vm.busyId === u.id}
                                  onClick={() => {
                                    void vm.approveUser(u.id)
                                  }}
                                >
                                  Onayla
                                </button>
                              ) : null}
                              <button
                                type="button"
                                className="adm-btn adm-btn--danger adm-btn--sm"
                                disabled={vm.busyId === u.id}
                                onClick={() => {
                                  vm.deleteUser(u.id)
                                }}
                              >
                                Sil
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ) : null}

            {vm.tab === 'categories' ? (
              <section className="adm-section">
                <div className="adm-category-form">
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="Yeni kategori adı"
                    value={vm.newCategoryName}
                    onChange={(e) => {
                      vm.setNewCategoryName(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void vm.addCategory()
                    }}
                  />
                  <button
                    type="button"
                    className="adm-btn adm-btn--primary"
                    disabled={vm.busyId === 'new-category'}
                    onClick={() => {
                      void vm.addCategory()
                    }}
                  >
                    Kategori Ekle
                  </button>
                </div>
                {vm.categories.length === 0 ? (
                  <p className="adm-state">Henüz kategori yok.</p>
                ) : (
                  <ul className="adm-category-list">
                    {vm.categories.map((c) => (
                      <li key={c.id} className="adm-category-item">
                        <span>{c.name}</span>
                        <button
                          type="button"
                          className="adm-btn adm-btn--danger adm-btn--sm"
                          disabled={vm.busyId === c.id}
                          onClick={() => {
                            vm.deleteCategory(c.id)
                          }}
                        >
                          Sil
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ) : null}

            {vm.tab === 'departments' ? (
              <section className="adm-section">
                <div className="adm-category-form">
                  <input
                    type="text"
                    className="adm-input"
                    placeholder="Yeni bölüm adı"
                    value={vm.newDepartmentName}
                    onChange={(e) => {
                      vm.setNewDepartmentName(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void vm.addDepartment()
                    }}
                  />
                  <button
                    type="button"
                    className="adm-btn adm-btn--primary"
                    disabled={vm.busyId === 'new-department'}
                    onClick={() => {
                      void vm.addDepartment()
                    }}
                  >
                    Bölüm Ekle
                  </button>
                </div>
                {vm.departments.length === 0 ? (
                  <p className="adm-state">Henüz bölüm yok.</p>
                ) : (
                  <ul className="adm-category-list">
                    {vm.departments.map((d) => (
                      <li key={d.id} className="adm-category-item">
                        <span>{d.name}</span>
                        <button
                          type="button"
                          className="adm-btn adm-btn--danger adm-btn--sm"
                          disabled={vm.busyId === d.id}
                          onClick={() => {
                            vm.deleteDepartment(d.id)
                          }}
                        >
                          Sil
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  )
}
