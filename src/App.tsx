import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { AskPage } from './pages/ask/AskPage'
import { HomePage } from './pages/home/HomePage'
import { MyQuestionsPage } from './pages/my-questions/MyQuestionsPage'
import { QuestionApprovalsPage } from './pages/question-approvals/QuestionApprovalsPage'
import { QuestionDetailPage } from './pages/question-detail/QuestionDetailPage'
import { AnswerQuestionsPage } from './pages/answer-questions/AnswerQuestionsPage'
import { FaqPage } from './pages/faq/FaqPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { AdminRoute } from './pages/admin/AdminRoute'
import { PendingApprovalPage } from './pages/pending-approval/PendingApprovalPage'
import { useAuth } from './shared/auth'

export default function App() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return null // or a loading spinner
  }

  const isAuthenticated = !!user
  // If profile is missing for an authenticated user, it means the Firestore document is still being created (registration race condition) or is missing.
  const isPending = isAuthenticated && (!profile || profile.isApproved === false)

  // Wrapper for routes that require authentication and approval
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (isPending) return <Navigate to="/pending-approval" replace />
    return <>{children}</>
  }

  // Wrapper for login/register to redirect away if already logged in
  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated) {
      return isPending ? <Navigate to="/pending-approval" replace /> : <Navigate to="/home" replace />
    }
    return <>{children}</>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              isPending ? <Navigate to="/pending-approval" replace /> : <Navigate to="/home" replace />
            ) : <Navigate to="/login" replace />
          } 
        />
        
        {/* Auth routes */}
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
        
        {/* Pending Approval Route */}
        <Route 
          path="/pending-approval" 
          element={
            isAuthenticated ? (
              isPending ? <PendingApprovalPage /> : <Navigate to="/home" replace />
            ) : <Navigate to="/login" replace />
          }
        />
        
        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/ask" element={<ProtectedRoute><AskPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><FaqPage /></ProtectedRoute>} />
        <Route path="/my-questions" element={<ProtectedRoute><MyQuestionsPage /></ProtectedRoute>} />
        <Route path="/answer-questions" element={<ProtectedRoute><AnswerQuestionsPage /></ProtectedRoute>} />
        <Route path="/question-approvals" element={<ProtectedRoute><QuestionApprovalsPage /></ProtectedRoute>} />
        <Route path="/question/:id" element={<ProtectedRoute><QuestionDetailPage /></ProtectedRoute>} />
        
        {/* Admin route handles its own protection internally but we can wrap it too if we want. It's safer to keep as is since AdminRoute has its own logic. */}
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

