import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Megaphone, Instagram, Users as UsersIcon } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { authService } from '../../services/authService'
import {
  influencerService,
  type InfluencerDashboardData
} from '../../services/influencerService'

export function InfluencerDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [dashboardData, setDashboardData] =
    useState<InfluencerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const data = await influencerService.getDashboard()
      setDashboardData(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dashboard')
      console.error('Erro ao carregar dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.signout()
      localStorage.removeItem('user')
      navigate('/signin')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    )
  }

  const profile = dashboardData?.profile
  const stats = dashboardData?.stats

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">Olá, {user.name}</span>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black">
            Bem-vindo, {profile?.name || user.name}!
          </h2>
          <p className="text-gray-600 mt-2">
            Gerencie suas campanhas e acompanhe seu desempenho
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Informações do Perfil */}
        {profile && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Meu Perfil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900">
                  {profile.email}
                </p>
              </div>
              {profile.instagram && (
                <div>
                  <p className="text-sm text-gray-500">Instagram</p>
                  <p className="text-base font-medium text-gray-900">
                    {profile.instagram}
                  </p>
                </div>
              )}
              {profile.tiktok && (
                <div>
                  <p className="text-sm text-gray-500">TikTok</p>
                  <p className="text-base font-medium text-gray-900">
                    {profile.tiktok}
                  </p>
                </div>
              )}
              {profile.youtube && (
                <div>
                  <p className="text-sm text-gray-500">YouTube</p>
                  <p className="text-base font-medium text-gray-900">
                    {profile.youtube}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Seguidores</p>
                <p className="text-base font-medium text-gray-900 flex items-center gap-1">
                  <UsersIcon className="h-4 w-4" />
                  {formatNumber(profile.followers || 0)}
                </p>
              </div>
            </div>
            {profile.bio && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Bio</p>
                <p className="text-base text-gray-700 mt-1">{profile.bio}</p>
              </div>
            )}
          </div>
        )}

        {/* Card de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/influencer/campaigns')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-black text-left w-full"
          >
            <Megaphone className="h-12 w-12 text-black mb-4" />
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Campanhas Vinculadas
            </h3>
            <p className="text-4xl font-bold text-black">
              {stats?.assignedCampaigns || 0}
            </p>
          </button>

          {/* Placeholder para futuras métricas */}
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent opacity-50">
            <Instagram className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-gray-500 text-sm font-medium mb-2">
              Engajamento Médio
            </h3>
            <p className="text-4xl font-bold text-gray-400">-</p>
            <p className="text-xs text-gray-400 mt-2">Em breve</p>
          </div>
        </div>
      </main>
    </div>
  )
}
