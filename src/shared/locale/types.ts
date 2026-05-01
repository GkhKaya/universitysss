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
  loginCta: string
}

export type LoginMessages = {
  heroTitle: string
  heroSubtitle: string
  heroImageAlt: string
  formTitle: string
  formSubtitle: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  passwordShowAria: string
  passwordHideAria: string
  submitButton: string
  submitLoading: string
  footerPrompt: string
  registerLink: string
  localeSwitchLabel: string
  errorRequired: string
  errorInvalidCredentials: string
  errorLoginFailed: string
  successLogin: string
}

export type AskMessages = {
  pageTitle: string
  pageSubtitle: string
  searchPlaceholder: string
  menuHome: string
  menuCategories: string
  menuScholarships: string
  menuRegistration: string
  menuMyQuestions: string
  menuAsk: string
  titleLabel: string
  titlePlaceholder: string
  categoryLabel: string
  categoryPlaceholder: string
  categoryLoading: string
  categoryLoadError: string
  contentLabel: string
  contentPlaceholder: string
  anonymousLabel: string
  targetAudienceLabel: string
  targetAudienceEveryone: string
  targetAudienceToStudent: string
  targetAudienceToTeacher: string
  submitButton: string
  submitLoading: string
  cancelButton: string
  successTitle: string
  successDescription: string
  successPrimaryAction: string
  successSecondaryAction: string
  tipsTitle: string
  tipsItems: string[]
  sampleCategoriesTitle: string
  errorRequired: string
  errorCategoryRequired: string
  errorTitleTooLong: string
  errorContentTooShort: string
  errorUnauthenticated: string
  errorProfileNotFound: string
  errorCategoryNotFound: string
  errorCreateFailed: string
}

export type AppMessages = {
  register: RegisterMessages
  login: LoginMessages
  home: HomeMessages
  ask: AskMessages
}
