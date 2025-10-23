import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { adminService, type BrandProfileResponse } from '../../services/adminService'

 

type ProfileData = BrandProfileResponse

export default function BrandCampaignsDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await adminService.getBrandProfile(id!)
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

  const { profile, campaigns } = profileData

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
            Campanhas - {profile.name}
          </h1>
          <p className="text-gray-600">Total de {campaigns.length} campanhas</p>
        </div>

        {/* Tabela de Campanhas */}
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">
              Nenhuma campanha criada ainda.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Campanha
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Período
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Influencers
                    </th>
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="text-gray-900 font-medium">
                          {campaign.name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700">
                          {campaign.budget
                            ? `R$ ${campaign.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            : 'Não definido'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700">
                          {campaign.startDate && campaign.endDate
                            ? `${new Date(campaign.startDate).toLocaleDateString('pt-BR')} - ${new Date(campaign.endDate).toLocaleDateString('pt-BR')}`
                            : 'Não definido'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700">
                          {campaign.assignedInfluencers}
                        </div>
                      </td>
                      <td className="py-4 px-6">
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
      </div>
    </div>
  )
}
