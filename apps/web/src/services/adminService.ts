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
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      credentials: 'include' // Importante para enviar cookies
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do dashboard')
    }

    const data = await response.json()
    return data.stats // Corrigido: backend retorna { stats: {...} }
  },

  async getInfluencers(): Promise<Influencer[]> {
    const response = await fetch(`${API_URL}/admin/influencers`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar influencers')
    }

    const data = await response.json()
    return data.data
  },

  async getBrands(): Promise<Brand[]> {
    const response = await fetch(`${API_URL}/admin/brands`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar marcas')
    }

    const data = await response.json()
    return data.data
  },

  async getCampaigns(): Promise<Campaign[]> {
    const response = await fetch(`${API_URL}/admin/campaigns`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar campanhas')
    }

    const data = await response.json()
    return data.data
  }
}
