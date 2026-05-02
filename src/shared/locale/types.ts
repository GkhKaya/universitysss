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
  departmentLabel: string
  departmentPlaceholder: string
  departmentLoading: string
  departmentLoadError: string
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
  errorDepartmentRequired: string
  errorDepartmentNotFound: string
  errorCategoryNotFound: string
  errorApprovalForbidden: string
  errorApprovalUpdateFailed: string
  errorCreateFailed: string
}

export type MyQuestionsMessages = {
  pageTitle: string
  pageSubtitle: string
  menuHome: string
  menuCategories: string
  menuScholarships: string
  menuRegistration: string
  menuMyQuestions: string
  menuAsk: string
  searchPlaceholder: string
  emptyTitle: string
  emptySubtitle: string
  askButton: string
  statusAll: string
  statusPending: string
  statusAnswered: string
  questionAnswers: string
  questionLikes: string
  questionPending: string
  questionAnswered: string
}

export type QuestionApprovalsMessages = {
  pageTitle: string
  pageSubtitle: string
  menuHome: string
  menuMyQuestions: string
  menuAsk: string
  menuApprovals: string
  emptyTitle: string
  emptySubtitle: string
  approveButton: string
  approvingButton: string
  successApproved: string
  accessDenied: string
  goHome: string
  genericError: string
}

export type AppMessages = {
  register: RegisterMessages
  login: LoginMessages
  home: HomeMessages
  ask: AskMessages
  myQuestions: MyQuestionsMessages
  questionApprovals: QuestionApprovalsMessages
}
