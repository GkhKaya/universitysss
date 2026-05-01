import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { HomePage } from './pages/home/HomePage'
import { AskPage } from './pages/ask/AskPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ask" element={<AskPage />} />
      </Routes>
    </BrowserRouter>
  )
}
