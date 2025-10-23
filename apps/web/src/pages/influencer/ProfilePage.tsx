import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'

interface InfluencerProfile {
  _id: string
  userId: string
  name: string
  email: string
  instagram?: string
  tiktok?: string
  youtube?: string
  followers: number
  bio?: string
}

interface Campaign {
  name: string
  budget: number
  startDate: string
  endDate: string
  status: string
}

interface ProfileData {
  profile: InfluencerProfile
  stats: {
    assignedCampaigns: number
    campaigns: Campaign[]
  }
}

export default function InfluencerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Detectar de onde veio o usuário
  const from = searchParams.get('from') || 'dashboard'
  const brandId = searchParams.get('brandId')

  // Calcular rota de volta baseada no 'from' e no role do usuário
  const getBackRoute = () => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return '/'

    const user = JSON.parse(userStr)

    // Se veio de 'brand-detail', voltar para a lista de influencers daquela marca
    if (from === 'brand-detail' && brandId) {
      return `/brand/${brandId}/influencers`
    }

    // Se veio de 'admin', voltar para lista de influencers do admin
    if (from === 'admin') {
      return '/admin/influencers'
    }

    // Se veio de 'brand', voltar para lista de influencers da marca
    if (from === 'brand') {
      return '/brand/influencers'
    }

    // Se veio de 'campaign', voltar para a página anterior (campanha)
    if (from === 'campaign') {
      return -1 // Usar navigate(-1) para voltar
    }

    // Se veio de 'dashboard' ou não especificado
    // Voltar para o dashboard correspondente ao role do usuário
    if (user.role === 'ori') {
      return '/admin/dashboard'
    } else if (user.role === 'brand') {
      return '/brand/dashboard'
    } else if (user.role === 'influencer') {
      return '/influencer/dashboard'
    }

    return '/'
  }

  const backRoute = getBackRoute()

  const handleBack = () => {
    if (backRoute === -1) {
      navigate(-1)
    } else {
      navigate(backRoute as string)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const response = await fetch(`${API_URL}/influencer/profile/${id}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar perfil do influencer')
        }

        const data = await response.json()
        setProfileData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProfile()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {error || 'Influencer não encontrado'}
        </div>
      </div>
    )
  }

  const { profile, stats } = profileData

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="text-white hover:text-gray-300 flex items-center gap-2 mb-4"
          >
            ← Voltar
          </button>
          <h1 className="text-4xl font-bold text-white">
            Perfil do Influencer
          </h1>
        </div>

        {/* Card de Perfil */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {profile.name}
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <p className="text-white font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Seguidores</p>
                  <p className="text-white font-medium">
                    {profile.followers.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Redes Sociais
              </h3>
              <div className="space-y-2">
                {profile.instagram && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">📷 Instagram:</span>
                    <a
                      href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200"
                    >
                      {profile.instagram}
                    </a>
                  </div>
                )}
                {profile.tiktok && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">🎵 TikTok:</span>
                    <a
                      href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200"
                    >
                      {profile.tiktok}
                    </a>
                  </div>
                )}
                {profile.youtube && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">▶️ YouTube:</span>
                    <a
                      href={profile.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-blue-200"
                    >
                      {profile.youtube}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Sobre</h3>
              <p className="text-gray-200">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Estatísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Campanhas Vinculadas</p>
              <p className="text-3xl font-bold text-white">
                {stats.assignedCampaigns}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Seguidores</p>
              <p className="text-3xl font-bold text-white">
                {profile.followers.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-300 text-sm">Engajamento</p>
              <p className="text-xl text-gray-400">Em breve</p>
            </div>
          </div>
        </div>

        {/* Campanhas Vinculadas */}
        {stats.campaigns.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Campanhas Vinculadas
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Campanha
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Budget
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Período
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.campaigns.map((campaign, index) => (
                    <tr
                      key={index}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="py-3 px-4 text-white">{campaign.name}</td>
                      <td className="py-3 px-4 text-white">
                        {campaign.budget
                          ? `R$ ${campaign.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                          : 'Não definido'}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {campaign.startDate && campaign.endDate
                          ? `${new Date(campaign.startDate).toLocaleDateString('pt-BR')} - ${new Date(campaign.endDate).toLocaleDateString('pt-BR')}`
                          : 'Não definido'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            campaign.status === 'active'
                              ? 'bg-green-500/20 text-green-300'
                              : campaign.status === 'inactive'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          {campaign.status === 'active'
                            ? 'Ativa'
                            : campaign.status === 'inactive'
                              ? 'Inativa'
                              : 'Completa'}
                        </span>
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
