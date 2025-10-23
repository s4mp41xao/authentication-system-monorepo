import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { authService } from '../../services/authService'
import { brandService } from '../../services/brandService'

interface BrandProfile {
  name: string
  email: string
  website?: string
  description?: string
  active: boolean
}

interface Campaign {
  name: string
  status: string
  budget: number
  startDate: string
  endDate: string
  assignedInfluencers: number
}

interface Influencer {
  _id: string
  userId: string
  name: string
  email: string
  instagram?: string
  followers: number
  active: boolean
  campaigns: Array<{
    name: string
    status: string
  }>
}

interface DashboardData {
  profile: BrandProfile
  stats: {
    totalCampaigns: number
    activeCampaigns: number
    connectedInfluencers: number
  }
  campaigns: Campaign[]
  influencers: Influencer[]
}

export function BrandDashboard() {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      console.log('🔍 [Dashboard] Carregando dados do dashboard...')

      // Usar brandService que inclui Authorization header
      const stats = await brandService.getDashboard()
      const influencers = await brandService.getInfluencers()
      const campaigns = await brandService.getCampaigns()

      // Adaptar os dados para o formato esperado
      setDashboardData({
        profile: {
          name: 'Brand Profile', // TODO: buscar do backend
          email: '',
          active: true
        },
        stats: {
          totalCampaigns: campaigns.length,
          activeCampaigns: stats.activeCampaigns,
          connectedInfluencers: stats.connectedInfluencers
        },
        influencers: influencers.map(inf => ({
          ...inf,
          campaigns: [] // TODO: buscar campanhas do influencer
        })),
        campaigns: campaigns.map(camp => ({
          name: camp.name,
          status: camp.status,
          budget: camp.budget,
          startDate: camp.startDate,
          endDate: camp.endDate,
          assignedInfluencers: camp.assignedInfluencers.length
        }))
      })

      console.log('✅ [Dashboard] Dados carregados com sucesso')
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dashboard')
      console.error('❌ [Dashboard] Erro:', err)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-700'
      case 'inactive':
        return 'bg-yellow-500/20 text-yellow-700'
      case 'completed':
        return 'bg-blue-500/20 text-blue-700'
      default:
        return 'bg-gray-500/20 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa'
      case 'inactive':
        return 'Inativa'
      case 'completed':
        return 'Completa'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Carregando...</div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error || 'Erro ao carregar dashboard'}
          </div>
        </main>
      </div>
    )
  }

  const { profile, stats, campaigns, influencers } = dashboardData

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard da Marca
          </h1>
          <Button variant="secondary" onClick={handleLogout}>
            Sair
          </Button>
        </div>

        {/* Card de Perfil */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.name}
              </h2>
              {profile.description && (
                <p className="text-gray-600">{profile.description}</p>
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                profile.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {profile.active ? 'Ativa' : 'Inativa'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <p className="text-gray-900 font-medium">{profile.email}</p>
            </div>
            {profile.website && (
              <div>
                <p className="text-gray-500 text-sm mb-1">Website</p>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <p className="text-gray-500 text-sm mb-2">Total de Campanhas</p>
            <p className="text-4xl font-bold text-gray-900">
              {stats.totalCampaigns}
            </p>
          </div>
          <div
            onClick={() => navigate('/brand/campaigns')}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <p className="text-gray-500 text-sm mb-2">Campanhas Ativas</p>
            <p className="text-4xl font-bold text-green-600">
              {stats.activeCampaigns}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Clique para ver detalhes
            </p>
          </div>
          <div
            onClick={() => navigate('/brand/influencers')}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <p className="text-gray-500 text-sm mb-2">Influencers Conectados</p>
            <p className="text-4xl font-bold text-blue-600">
              {stats.connectedInfluencers}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Clique para ver detalhes
            </p>
          </div>
        </div>

        {/* Campanhas */}
        {campaigns.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Campanhas</h2>
              <button
                onClick={() => navigate('/brand/campaigns')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todas →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Campanha
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Budget
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Período
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Influencers
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.slice(0, 5).map((campaign, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {campaign.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {campaign.budget
                          ? `R$ ${campaign.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : 'Não definido'}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {campaign.startDate && campaign.endDate
                          ? `${new Date(campaign.startDate).toLocaleDateString('pt-BR')} - ${new Date(campaign.endDate).toLocaleDateString('pt-BR')}`
                          : 'Não definido'}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {campaign.assignedInfluencers}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                        >
                          {getStatusLabel(campaign.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Influencers */}
        {influencers.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Influencers Vinculados
              </h2>
              <button
                onClick={() => navigate('/brand/influencers')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todos →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Nome
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Instagram
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Seguidores
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">
                      Campanhas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {influencers.slice(0, 5).map(influencer => (
                    <tr
                      key={influencer._id}
                      onClick={() =>
                        navigate(
                          `/influencer/profile/${influencer._id}?from=brand`
                        )
                      }
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {influencer.name}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {influencer.email}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {influencer.instagram || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {influencer.followers.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {influencer.campaigns.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
