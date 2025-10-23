const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface InfluencerProfile {
  name: string
  email: string
  instagram?: string
  tiktok?: string
  youtube?: string
  followers: number
  bio?: string
}

export interface InfluencerDashboardData {
  profile: InfluencerProfile | null
  stats: {
    assignedCampaigns: number
  }
}

export interface CampaignWithBrand {
  _id: string
  name: string
  description: string
  brandId: string
  brandName: string
  budget: number
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  assignedInfluencers: string[]
}

export const influencerService = {
  async getDashboard(): Promise<InfluencerDashboardData> {
    // Tentar obter token do localStorage (fallback para cross-origin)
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(`${API_URL}/influencer/dashboard`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do dashboard')
    }

    const data = await response.json()
    return {
      profile: data.profile,
      stats: data.stats
    }
  },

  async getCampaigns(): Promise<CampaignWithBrand[]> {
    const response = await fetch(`${API_URL}/influencer/campaigns`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar campanhas')
    }

    const data = await response.json()
    return data.data
  }
}
