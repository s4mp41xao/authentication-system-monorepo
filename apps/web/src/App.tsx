import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { SignupPage } from './pages/auth/SignupPage'
import { SigninPage } from './pages/auth/SigninPage'
import { InfluencerDashboard } from './pages/influencer/Dashboard'
import { InfluencerCampaignsListPage } from './pages/influencer/CampaignsListPage'
import InfluencerProfilePage from './pages/influencer/ProfilePage'
import { BrandDashboard } from './pages/brand/Dashboard'
import { BrandInfluencersListPage } from './pages/brand/InfluencersListPage'
import { BrandCampaignsListPage } from './pages/brand/CampaignsListPage'
import { BrandCampaignDetailsPage } from './pages/brand/CampaignDetailsPage'
import BrandProfilePage from './pages/brand/ProfilePage'
import BrandInfluencersDetailsPage from './pages/brand/InfluencersDetailsPage'
import BrandCampaignsDetailsPage from './pages/brand/CampaignsDetailsPage'
import { AdminDashboard } from './pages/admin/Dashboard'
import { InfluencersListPage } from './pages/admin/InfluencersListPage'
import { BrandsListPage } from './pages/admin/BrandsListPage'
import { CampaignsListPage } from './pages/admin/CampaignsListPage'

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

        {/* Rotas Admin ORI */}
        <Route path="/admin/influencers" element={<InfluencersListPage />} />
        <Route path="/admin/brands" element={<BrandsListPage />} />
        <Route path="/admin/campaigns" element={<CampaignsListPage />} />

        {/* Rotas Brand */}
        <Route
          path="/brand/influencers"
          element={<BrandInfluencersListPage />}
        />
        <Route path="/brand/campaigns" element={<BrandCampaignsListPage />} />
        <Route
          path="/brand/campaigns/:id"
          element={<BrandCampaignDetailsPage />}
        />
        <Route path="/brand/profile/:id" element={<BrandProfilePage />} />
        <Route
          path="/brand/:id/influencers"
          element={<BrandInfluencersDetailsPage />}
        />
        <Route
          path="/brand/:id/campaigns"
          element={<BrandCampaignsDetailsPage />}
        />

        {/* Rotas Influencer */}
        <Route
          path="/influencer/campaigns"
          element={<InfluencerCampaignsListPage />}
        />
        <Route
          path="/influencer/profile/:id"
          element={<InfluencerProfilePage />}
        />

        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
