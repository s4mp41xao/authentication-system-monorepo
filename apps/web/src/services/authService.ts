import type { SignupDto, SigninDto, AuthResponse, User } from '../types'

const API_URL = import.meta.env.VITE_API_URL || ''

class AuthService {
  /**
   * Registrar novo usuário
   */
  async signup(data: SignupDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Importante para cookies do Better Auth
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao criar conta')
    }

    return response.json()
  }

  /**
   * Fazer login
   */
  async signin(data: SigninDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao fazer login')
    }

    return response.json()
  }

  /**
   * Fazer logout
   */
  async signout(): Promise<void> {
    const response = await fetch(`${API_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao fazer logout')
    }
  }

  /**
   * Obter usuário atual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include'
      })

      if (!response.ok) {
        return null
      }

      return response.json()
    } catch (error) {
      return null
    }
  }
}

export const authService = new AuthService()
