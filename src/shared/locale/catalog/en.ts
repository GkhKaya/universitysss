import type { AppMessages } from '../types'

export const en: AppMessages = {
  home: {
    title: 'universitysss',
    description:
      'A Q&A app for university life. We are still building content and the interface.',
    registerCta: 'Sign up',
  },
  register: {
    heroTitle: 'Meet in the light of knowledge.',
    heroSubtitle:
      'Answers that make campus life easier—curated with care.',
    heroImageAlt: 'Dumlupınar University Faculty of Engineering logo',
    formTitle: 'Join us',
    formSubtitle: 'You are only a few steps away from your place in the academic world.',
    roleLabel: 'Role',
    roleStudent: 'Student',
    roleTeacher: 'Teacher',
    fullNameLabel: 'Full name',
    fullNamePlaceholder: 'e.g. Jane Doe',
    emailLabel: 'University email',
    emailPlaceholder: 'name@ogr.dpu.edu.tr or name@dpu.edu.tr',
    departmentLabel: 'Department',
    departmentPlaceholder: 'Pick from list or search…',
    departmentLoading: 'Loading departments…',
    departmentLoadError: 'Could not load departments. Refresh the page.',
    departmentEmpty: 'No departments yet. An admin must add them in Firestore.',
    departmentNoMatch: 'No department matches your search.',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    passwordShowAria: 'Show password',
    passwordHideAria: 'Hide password',
    termsPrefix: 'By signing up you accept the ',
    termsLink: 'Terms of Use',
    termsMiddle: ' and the ',
    privacyLink: 'Privacy Policy',
    termsSuffix: '.',
    submitButton: 'Create account',
    submitLoading: 'Saving…',
    footerPrompt: 'Already have an account?',
    loginLink: 'Log in',
    localeSwitchLabel: 'Language',
    errorRequired: 'Please fill in all fields.',
    errorDepartmentRequired: 'Please select a department from the list.',
    errorPasswordLength: 'Password must be at least 6 characters.',
    errorEmailStudentDomain:
      'Student registration only accepts addresses that are exactly @ogr.dpu.edu.tr (plain @dpu.edu.tr is not allowed).',
    errorEmailTeacherDomain:
      'Faculty registration only accepts addresses that are exactly @dpu.edu.tr (@ogr.dpu.edu.tr is not allowed).',
    errorSignup: 'Sign-up failed. Check your details.',
    errorRoleNotFound:
      'The selected role does not match Firestore. Check userRoles documents in the admin console.',
    errorDepartmentNotFound:
      'Department not found. Type the full name or a substring that matches a department record.',
    errorProfileWrite: 'Account was created but the profile document could not be saved. Contact support.',
    successSignup: 'Your account was created. Redirecting to sign-in…',
  },
}
