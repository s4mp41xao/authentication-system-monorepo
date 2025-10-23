import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { authService } from '../../services/authService'
import { adminService, type DashboardStats } from '../../services/adminService'
import { Users, Building2, Megaphone } from 'lucide-react'

export function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboard()
      setStats(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar estatísticas')
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
            Bem-vindo, Administrador!
          </h2>
          <p className="text-gray-600 mt-2">
            Gerencie influenciadores, marcas e campanhas
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/campaigns')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-left border-2 border-transparent hover:border-black"
          >
            <Megaphone className="h-12 w-12 text-black mb-4" />
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Campanhas Ativas
            </h3>
            <p className="text-4xl font-bold text-black">
              {stats?.activeCampaigns || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Clique para ver →</p>
          </button>

          <button
            onClick={() => navigate('/admin/influencers')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-left border-2 border-transparent hover:border-black"
          >
            <Users className="h-12 w-12 text-black mb-4" />
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Influenciadores
            </h3>
            <p className="text-4xl font-bold text-black">
              {stats?.totalInfluencers || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Clique para ver →</p>
          </button>

          <button
            onClick={() => navigate('/admin/brands')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 text-left border-2 border-transparent hover:border-black"
          >
            <Building2 className="h-12 w-12 text-black mb-4" />
            <h3 className="text-gray-600 text-sm font-medium mb-2">Marcas</h3>
            <p className="text-4xl font-bold text-black">
              {stats?.totalBrands || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">Clique para ver →</p>
          </button>
        </div>
      </main>
    </div>
  )
}
