/** Dumlupınar Üniversitesi kurumsal e-posta kuralları (kayıt formu) */

const STUDENT_DOMAIN = 'ogr.dpu.edu.tr'
const TEACHER_DOMAIN = 'dpu.edu.tr'

function parseEmailDomain(email: string): string | null {
  const normalized = email.trim().toLowerCase()
  const at = normalized.lastIndexOf('@')
  if (at <= 0 || at !== normalized.indexOf('@')) {
    return null
  }
  const local = normalized.slice(0, at)
  const domain = normalized.slice(at + 1)
  if (!local || !domain) {
    return null
  }
  return domain
}

/** Öğrenci: yalnızca tam alan adı ogr.dpu.edu.tr (ör. user@dpu.edu.tr kabul edilmez) */
export function isValidDpuStudentEmail(email: string): boolean {
  return parseEmailDomain(email) === STUDENT_DOMAIN
}

/** Öğretmen: yalnızca tam alan adı dpu.edu.tr; ogr.dpu.edu.tr kabul edilmez */
export function isValidDpuTeacherEmail(email: string): boolean {
  return parseEmailDomain(email) === TEACHER_DOMAIN
}
