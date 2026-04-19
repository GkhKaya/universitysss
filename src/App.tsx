import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage } from './features/auth'
import { HomePage } from './pages/home/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
