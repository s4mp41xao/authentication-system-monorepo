const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface BrandDashboardStats {
  activeCampaigns: number
  connectedInfluencers: number
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

export interface Campaign {
  _id: string
  name: string
  description: string
  brandId: string
  budget: number
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  assignedInfluencers: string[]
  influencersCount?: number
}

export interface CampaignDetails {
  campaign: Campaign
  influencers: Influencer[]
}

export const brandService = {
  async getDashboard(): Promise<BrandDashboardStats> {
    const response = await fetch(`${API_URL}/brand/dashboard`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do dashboard')
    }

    const data = await response.json()
    return data.stats
  },

  async getInfluencers(): Promise<Influencer[]> {
    const response = await fetch(`${API_URL}/brand/influencers`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar influencers')
    }

    const data = await response.json()
    return data.data
  },

  async getCampaigns(brandId?: string): Promise<Campaign[]> {
    const url = brandId
      ? `${API_URL}/brand/campaigns?brandId=${brandId}`
      : `${API_URL}/brand/campaigns`

    const response = await fetch(url, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar campanhas')
    }

    const data = await response.json()
    return data.data
  },

  async getCampaignDetails(campaignId: string): Promise<CampaignDetails> {
    const response = await fetch(`${API_URL}/brand/campaigns/${campaignId}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes da campanha')
    }

    const data = await response.json()
    return data.data
  }
}
