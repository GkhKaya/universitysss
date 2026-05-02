import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './shared/auth'
import { LocaleProvider } from './shared/locale'
import { ThemeProvider } from './shared/theme'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <LocaleProvider>
          <App />
        </LocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
