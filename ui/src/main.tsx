import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RecognitionDashboard from './dashboard/RecognitionDashboard'
import './style.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode><RecognitionDashboard /></StrictMode>,
)
