import { buildAuthHeaders } from './authHeaders'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// FORCE REBUILD - v2.1.0 - Authorization Header Implementation + fallback
console.log(
  '🚀 [BrandService] Carregado com suporte a Authorization Header v2.1.0'
)

export interface BrandDashboardStats {
  totalCampaigns: number
  activeCampaigns: number
  connectedInfluencers: number
}

export interface BrandProfile {
  name: string
  email: string
  website?: string
  description?: string
  active: boolean
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
  campaigns?: Array<{ name: string; status: string }>
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

export interface BrandDashboardResponse {
  profile: BrandProfile | null
  stats: BrandDashboardStats
  campaigns: Array<{
    name: string
    status: string
    budget?: number
    startDate?: string
    endDate?: string
    assignedInfluencers: number
  }>
  influencers: Influencer[]
}

export const brandService = {
  async getDashboard(): Promise<BrandDashboardResponse> {
    const headers = buildAuthHeaders()

    const response = await fetch(`${API_URL}/brand/dashboard`, {
      credentials: 'include',
      headers
    })

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do dashboard')
    }

    const data = await response.json()
    return {
      profile: data.profile ?? null,
      stats: {
        totalCampaigns: data.stats?.totalCampaigns ?? (data.campaigns?.length ?? 0),
        activeCampaigns: data.stats?.activeCampaigns ?? 0,
        connectedInfluencers: data.stats?.connectedInfluencers ?? 0
      },
      campaigns: (data.campaigns ?? []).map((campaign: any) => ({
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget ?? undefined,
        startDate: campaign.startDate ?? undefined,
        endDate: campaign.endDate ?? undefined,
        assignedInfluencers:
          typeof campaign.assignedInfluencers === 'number'
            ? campaign.assignedInfluencers
            : Array.isArray(campaign.assignedInfluencers)
              ? campaign.assignedInfluencers.length
              : 0
      })),
      influencers: (data.influencers ?? []).map((influencer: any) => ({
        ...influencer,
        campaigns: influencer.campaigns ?? []
      }))
    }
  },

  async getInfluencers(): Promise<Influencer[]> {
    const headers = buildAuthHeaders()

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
    const headers = buildAuthHeaders()

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
    const headers = buildAuthHeaders()

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
