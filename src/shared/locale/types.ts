export type Locale = 'tr' | 'en'

export type RegisterMessages = {
  heroTitle: string
  heroSubtitle: string
  heroImageAlt: string
  formTitle: string
  formSubtitle: string
  roleLabel: string
  roleStudent: string
  roleTeacher: string
  fullNameLabel: string
  fullNamePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  departmentLabel: string
  departmentPlaceholder: string
  departmentLoading: string
  departmentLoadError: string
  departmentEmpty: string
  departmentNoMatch: string
  passwordLabel: string
  passwordPlaceholder: string
  passwordShowAria: string
  passwordHideAria: string
  termsPrefix: string
  termsLink: string
  termsMiddle: string
  privacyLink: string
  termsSuffix: string
  submitButton: string
  submitLoading: string
  footerPrompt: string
  loginLink: string
  localeSwitchLabel: string
  errorRequired: string
  errorDepartmentRequired: string
  errorPasswordLength: string
  errorEmailStudentDomain: string
  errorEmailTeacherDomain: string
  errorSignup: string
  errorRoleNotFound: string
  errorDepartmentNotFound: string
  errorProfileWrite: string
  successSignup: string
}

export type HomeMessages = {
  title: string
  description: string
  registerCta: string
}

export type AppMessages = {
  register: RegisterMessages
  home: HomeMessages
}
