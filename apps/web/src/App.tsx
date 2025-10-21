import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { SignupPage } from './pages/auth/SignupPage'
import { SigninPage } from './pages/auth/SigninPage'
import { InfluencerDashboard } from './pages/influencer/Dashboard'
import { BrandDashboard } from './pages/brand/Dashboard'
import { AdminDashboard } from './pages/admin/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Rotas de autenticação */}
        <Route path="/register" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />

        {/* Dashboards por role */}
        <Route path="/influencer/dashboard" element={<InfluencerDashboard />} />
        <Route path="/brand/dashboard" element={<BrandDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
