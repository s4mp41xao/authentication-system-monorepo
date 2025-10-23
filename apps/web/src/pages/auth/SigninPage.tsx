import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { authService } from '../../services/authService'
import type { SigninDto } from '../../types'

export function SigninPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<SigninDto>({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.signin(formData)
      console.log('Login bem-sucedido:', response)

      // Armazenar dados do usuário E token
      const userWithToken = {
        ...response.user,
        token: response.token || (response as any).session?.token
      }
      localStorage.setItem('user', JSON.stringify(userWithToken))
      console.log('✅ User e token salvos no localStorage')

      // Redirecionar baseado no role (case-insensitive)
      const userRole = response.user.role?.toLowerCase()
      if (userRole === 'ori') {
        navigate('/admin/dashboard')
      } else if (userRole === 'brand') {
        navigate('/brand/dashboard')
      } else if (userRole === 'influencer') {
        navigate('/influencer/dashboard')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-black transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
            <h2 className="text-3xl font-bold text-black">Entrar</h2>
            <p className="mt-2 text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-black hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black"
                >
                  Senha
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => alert('Funcionalidade em desenvolvimento')}
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-4xl font-bold mb-4">Bem-vindo de volta!</h3>
            <p className="text-xl text-gray-300 max-w-md">
              Acesse sua conta e continue gerenciando suas campanhas e conexões.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
