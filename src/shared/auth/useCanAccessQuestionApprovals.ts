import { useAuth } from './useAuth'
import { canAccessQuestionApprovals } from './role-permissions'

export function useCanAccessQuestionApprovals() {
  const { profile } = useAuth()
  
  return Boolean(profile && canAccessQuestionApprovals(profile))
}
