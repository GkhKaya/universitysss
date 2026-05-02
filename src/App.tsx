import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { AskPage } from './pages/ask/AskPage'
import { HomePage } from './pages/home/HomePage'
import { MyQuestionsPage } from './pages/my-questions/MyQuestionsPage'
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
        
        {/* Protected routes (for now we let them render, but they can handle their own unauthenticated state or we can protect them) */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/ask" element={user ? <AskPage /> : <Navigate to="/login" replace />} />
        <Route path="/my-questions" element={user ? <MyQuestionsPage /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

