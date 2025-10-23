import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { authService } from '../../services/authService'
import {
  influencerService,
  type CampaignWithBrand
} from '../../services/influencerService'

export function InfluencerCampaignsListPage() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState<CampaignWithBrand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const data = await influencerService.getCampaigns()
      setCampaigns(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar campanhas')
      console.error('Erro ao carregar campanhas:', err)
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Minhas Campanhas
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
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/influencer/dashboard"
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Total de Campanhas: {campaigns.length}
            </h2>
          </div>

          {campaigns.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Você ainda não está vinculado a nenhuma campanha.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campanha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map(campaign => (
                    <tr key={campaign._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {campaign.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {campaign.brandName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(campaign.budget)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(campaign.startDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          até {formatDate(campaign.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}
                        >
                          {getStatusLabel(campaign.status)}
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
