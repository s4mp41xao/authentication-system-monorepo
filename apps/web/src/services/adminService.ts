const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface DashboardStats {
  activeCampaigns: number
  totalInfluencers: number
  totalBrands: number
}

export interface Influencer {
  _id: string
  userId: string
  name: string
  email: string
  bio?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  followers: number
  active: boolean
}

export interface Brand {
  _id: string
  userId: string
  name: string
  email: string
  description?: string
  website?: string
  industry?: string
  active: boolean
}

export interface Campaign {
  _id: string
  name: string
  brandId: string
  description?: string
  status: 'active' | 'inactive' | 'completed'
  budget?: number
  startDate?: string
  endDate?: string
  assignedInfluencers: string[]
}

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    // Extrair token do localStorage
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/admin/dashboard`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do dashboard')
    }

    const data = await response.json()
    return data.stats // Corrigido: backend retorna { stats: {...} }
  },

  async getInfluencers(): Promise<Influencer[]> {
    // Extrair token do localStorage
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/admin/influencers`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar influencers')
    }

    const data = await response.json()
    return data.data
  },

  async getBrands(): Promise<Brand[]> {
    // Extrair token do localStorage
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/admin/brands`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar marcas')
    }

    const data = await response.json()
    return data.data
  },

  async getCampaigns(): Promise<Campaign[]> {
    // Extrair token do localStorage
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/admin/campaigns`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar campanhas')
    }

    const data = await response.json()
    return data.data
  }
}
