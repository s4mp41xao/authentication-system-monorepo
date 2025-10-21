import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { authService } from '../../services/authService';

export function InfluencerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    try {
      await authService.signout();
      localStorage.removeItem('user');
      navigate('/signin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard Influencer</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">Olá, {user.name}</span>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Bem-vindo, Influencer!</h2>
            <p className="text-gray-600 mb-4">
              Este é o seu dashboard de influenciador.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Campanhas Disponíveis</h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Candidaturas</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Colaborações Ativas</h3>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
