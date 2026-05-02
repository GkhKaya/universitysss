import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { AskPage } from './pages/ask/AskPage'
import { HomePage } from './pages/home/HomePage'
import { MyQuestionsPage } from './pages/my-questions/MyQuestionsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/my-questions" element={<MyQuestionsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
