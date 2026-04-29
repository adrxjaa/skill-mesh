import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { MatchProvider } from './context/MatchContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <MatchProvider>
        <App />
      </MatchProvider>
    </AuthProvider>
  </StrictMode>,
)
