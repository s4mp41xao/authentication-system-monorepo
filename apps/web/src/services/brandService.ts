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
    // Extrair token do localStorage
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null

    console.log('🔍 [BrandService] getDashboard chamado')
    console.log('   User no localStorage:', user ? 'SIM' : 'NÃO')
    console.log('   Token extraído:', token ? `${token.substring(0, 10)}...` : 'NENHUM')

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log('   ✅ Authorization header adicionado')
    } else {
      console.log('   ⚠️  Sem token - Authorization header NÃO adicionado')
    }

    const response = await fetch(`${API_URL}/brand/dashboard`, {
      credentials: 'include',
      headers
    })

    console.log('   Response status:', response.status)

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do dashboard')
    }

    const data = await response.json()
    return data.stats
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

    const response = await fetch(`${API_URL}/brand/influencers`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar influencers')
    }

    const data = await response.json()
    return data.data
  },

  async getCampaigns(brandId?: string): Promise<Campaign[]> {
    // Extrair token do localStorage
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const url = brandId
      ? `${API_URL}/brand/campaigns?brandId=${brandId}`
      : `${API_URL}/brand/campaigns`

    const response = await fetch(url, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar campanhas')
    }

    const data = await response.json()
    return data.data
  },

  async getCampaignDetails(campaignId: string): Promise<CampaignDetails> {
    // Extrair token do localStorage
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}/brand/campaigns/${campaignId}`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes da campanha')
    }

    const data = await response.json()
    return data.data
  }
}
