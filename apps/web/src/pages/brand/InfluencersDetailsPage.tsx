import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'

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

interface BrandProfile {
  name: string
}

interface ProfileData {
  profile: BrandProfile
  influencers: Influencer[]
}

export default function BrandInfluencersDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/brand/profile/${id}`,
          {
            credentials: 'include'
          }
        )

        if (!response.ok) {
          throw new Error('Erro ao carregar dados da marca')
        }

        const data = await response.json()
        setProfileData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
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
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-gray-600 text-xl">Carregando...</div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-red-600 text-xl">
          {error || 'Dados não encontrados'}
        </div>
      </div>
    )
  }

  const { profile, influencers } = profileData

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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/brand/profile/${id}`)}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Perfil da Marca
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Influencers - {profile.name}
          </h1>
          <p className="text-gray-600">
            Total de {influencers.length} influencers vinculados
          </p>
        </div>

        {/* Tabela de Influencers */}
        {influencers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">
              Nenhum influencer vinculado a esta marca ainda.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Instagram
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Seguidores
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Campanhas Vinculadas
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {influencers.map(influencer => (
                    <tr
                      key={influencer._id}
                      onClick={() =>
                        navigate(
                          `/influencer/profile/${influencer._id}?from=brand-detail&brandId=${id}`
                        )
                      }
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="text-gray-900 font-medium">
                          {influencer.name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700">{influencer.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700">
                          {influencer.instagram || '-'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700">
                          {influencer.followers.toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          {influencer.campaigns.length === 0 ? (
                            <span className="text-gray-500 text-sm">
                              Nenhuma
                            </span>
                          ) : (
                            influencer.campaigns.map((campaign, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-gray-900 text-sm">
                                  {campaign.name}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                                >
                                  {getStatusLabel(campaign.status)}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            influencer.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {influencer.active ? 'Ativo' : 'Inativo'}
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
