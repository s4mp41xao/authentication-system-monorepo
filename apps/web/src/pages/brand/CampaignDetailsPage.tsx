import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { authService } from '../../services/authService'
import { brandService, type CampaignDetails } from '../../services/brandService'

export function BrandCampaignDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const brandId = searchParams.get('brandId')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [details, setDetails] = useState<CampaignDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Determina a rota de volta baseado no contexto
  const backRoute = brandId
    ? `/brand/campaigns?brandId=${brandId}`
    : user.role === 'ori'
      ? '/admin/campaigns'
      : '/brand/campaigns'

  useEffect(() => {
    if (id) {
      loadCampaignDetails()
    }
  }, [id])

  const loadCampaignDetails = async () => {
    if (!id) return

    try {
      const data = await brandService.getCampaignDetails(id)
      setDetails(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar detalhes da campanha')
      console.error('Erro ao carregar campanha:', err)
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa'
      case 'draft':
        return 'Rascunho'
      case 'paused':
        return 'Pausada'
      case 'completed':
        return 'Concluída'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Detalhes da Campanha
              </h1>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to={backRoute}
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Campanhas
            </Link>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error || 'Campanha não encontrada'}
          </div>
        </main>
      </div>
    )
  }

  const { campaign, influencers } = details

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Detalhes da Campanha
            </h1>
            <div className="flex items-center gap-4">
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to={backRoute}
            className="flex items-center text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Campanhas
          </Link>
        </div>

        {/* Informações da Campanha */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {campaign.name}
                </h2>
                <p className="text-gray-600 mt-1">{campaign.description}</p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(campaign.status)}`}
              >
                {getStatusLabel(campaign.status)}
              </span>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Budget
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(campaign.budget)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Data de Início
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(campaign.startDate)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Data de Término
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(campaign.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Influencers Vinculados */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Influenciadores Vinculados ({influencers.length})
            </h2>
          </div>

          {influencers.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Nenhum influenciador vinculado a esta campanha ainda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instagram
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seguidores
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {influencers.map(influencer => (
                    <tr
                      key={influencer._id}
                      onClick={() =>
                        navigate(
                          `/influencer/profile/${influencer._id}?from=campaign`
                        )
                      }
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {influencer.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {influencer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {influencer.instagram || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {influencer.followers?.toLocaleString('pt-BR') || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
          )}
        </div>
      </main>
    </div>
  )
}
