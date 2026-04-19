import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RegisterPage } from './features/register'
import { HomePage } from './pages/home/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
