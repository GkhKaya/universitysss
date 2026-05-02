import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { AskPage } from './pages/ask/AskPage'
import { HomePage } from './pages/home/HomePage'
import { MyQuestionsPage } from './pages/my-questions/MyQuestionsPage'
import { QuestionApprovalsPage } from './pages/question-approvals/QuestionApprovalsPage'
import { QuestionDetailPage } from './pages/question-detail/QuestionDetailPage'
import { AnswerQuestionsPage } from './pages/answer-questions/AnswerQuestionsPage'
import { FaqPage } from './pages/faq/FaqPage'
import { useAuth } from './shared/auth'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return null // or a loading spinner
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/home' : '/login'} replace />} />
        
        {/* Auth routes: Redirect to home if already logged in */}
        <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/home" replace /> : <RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" replace />} />
        <Route path="/ask" element={user ? <AskPage /> : <Navigate to="/login" replace />} />
        <Route path="/faq" element={user ? <FaqPage /> : <Navigate to="/login" replace />} />
        <Route path="/my-questions" element={user ? <MyQuestionsPage /> : <Navigate to="/login" replace />} />
        <Route path="/answer-questions" element={user ? <AnswerQuestionsPage /> : <Navigate to="/login" replace />} />
        <Route
          path="/question-approvals"
          element={user ? <QuestionApprovalsPage /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/question/:id" 
          element={user ? <QuestionDetailPage /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

