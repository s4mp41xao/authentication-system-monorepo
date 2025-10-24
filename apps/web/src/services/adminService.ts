import { buildAuthHeaders } from './authHeaders'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// FORCE REBUILD - v2.1.0 - Authorization Header Implementation + fallback
console.log(
  '🚀 [AdminService] Carregado com suporte a Authorization Header v2.1.0'
)

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

export interface BrandProfileResponse {
  profile: {
    _id: string
    userId: string
    name: string
    email: string
    website?: string
    description?: string
    industry?: string
    active: boolean
  }
  stats: {
    totalCampaigns: number
    activeCampaigns: number
    connectedInfluencers: number
  }
  campaigns: Array<{
    _id: string
    name: string
    description?: string
    status: string
    budget?: number
    startDate?: string
    endDate?: string
    assignedInfluencers: any
  }>
  influencers: Array<{
    _id: string
    userId: string
    name: string
    email: string
    instagram?: string
    tiktok?: string
    youtube?: string
    followers: number
    active: boolean
    campaigns: Array<{ name: string; status: string }>
  }>
}

export const adminService = {
  async getDashboard(): Promise<DashboardStats> {
    const headers = buildAuthHeaders()

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
    const headers = buildAuthHeaders()

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
    const headers = buildAuthHeaders()

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
    const headers = buildAuthHeaders()

    const response = await fetch(`${API_URL}/admin/campaigns`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar campanhas')
    }

    const data = await response.json()
    return data.data
  },
  async getBrandProfile(brandId: string): Promise<BrandProfileResponse> {
    const headers = buildAuthHeaders()

    const response = await fetch(`${API_URL}/brand/profile/${brandId}`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao carregar perfil da marca')
    }

    return response.json()
  }
}
