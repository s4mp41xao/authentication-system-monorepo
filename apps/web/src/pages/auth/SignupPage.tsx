import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, Building, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { authService } from '../../services/authService'
import { UserRole } from '../../types'
import type { SignupDto } from '../../types'

export function SignupPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<SignupDto>({
    name: '',
    email: '',
    password: '',
    role: UserRole.INFLUENCER
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const userTypeOptions = [
    {
      type: UserRole.INFLUENCER,
      title: 'Influenciador',
      description: 'Crie conteúdo e conecte-se com marcas',
      icon: Users
    },
    {
      type: UserRole.BRAND,
      title: 'Marca',
      description: 'Encontre influenciadores para suas campanhas',
      icon: Building
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUserTypeSelect = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.signup(formData)
      console.log('Usuário criado:', response)

      // Armazenar dados do usuário
      localStorage.setItem('user', JSON.stringify(response.user))

      // Redirecionar baseado no role
      if (response.user.role === UserRole.ORI) {
        navigate('/admin/dashboard')
      } else if (response.user.role === UserRole.BRAND) {
        navigate('/brand/dashboard')
      } else {
        navigate('/influencer/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
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
            <h2 className="text-3xl font-bold text-black">Criar Conta</h2>
            <p className="mt-2 text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/signin" className="text-black hover:underline">
                Faça login
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

              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-black mb-3">
                  Tipo de Perfil
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {userTypeOptions.map(option => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.type}
                        type="button"
                        onClick={() => handleUserTypeSelect(option.type)}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          formData.role === option.type
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="h-5 w-5 mr-3 text-black" />
                          <div>
                            <div className="font-medium text-black">
                              {option.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black"
                >
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  placeholder="Seu nome completo"
                />
              </div>

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
                    minLength={6}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    placeholder="Mínimo 6 caracteres"
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
                  {loading ? 'Criando conta...' : 'Criar Conta'}
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
            <h3 className="text-4xl font-bold mb-4">Bem-vindo!</h3>
            <p className="text-xl text-gray-300 max-w-md">
              Junte-se à nossa plataforma e conecte-se com influenciadores e
              marcas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
