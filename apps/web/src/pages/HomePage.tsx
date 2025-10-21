import { Link } from 'react-router-dom'
import { ArrowRight, Users, Building, Shield } from 'lucide-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">ORI Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h2 className="text-5xl font-bold text-black mb-6">
            Sistema de Autenticação
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Plataforma completa para gerenciamento de usuários com três perfis
            distintos: Influenciadores, Marcas e ORI.
          </p>

          <div className="flex justify-center space-x-4 mb-16">
            <Link
              to="/register"
              className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/signin"
              className="border border-gray-300 text-black px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fazer Login
            </Link>
          </div>

          {/* User Types */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Influenciador
              </h3>
              <p className="text-gray-600">
                Gerencie seu perfil, campanhas e métricas de engajamento.
              </p>
            </div>

            <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Marca</h3>
              <p className="text-gray-600">
                Encontre influenciadores e gerencie suas campanhas de marketing.
              </p>
            </div>

            <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">ORI</h3>
              <p className="text-gray-600">
                Administre a plataforma e monitore todas as atividades.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 ORI Platform. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
