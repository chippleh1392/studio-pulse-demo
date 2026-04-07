import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Suppress echarts disconnect warnings in development (React StrictMode + echarts-for-react compatibility issue)
if (import.meta.env.DEV) {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      (args[0].includes("Cannot read properties of undefined (reading 'disconnect')") ||
       args[0].includes('disconnect'))
    ) {
      // Suppress echarts disconnect errors - harmless development warning
      return
    }
    originalError(...args)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
