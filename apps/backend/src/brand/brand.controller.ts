import { Controller, Get, Req, UseGuards, Param, Query } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../auth/enums/user-role.enum.js';
import { CampaignService } from '../admin/services/campaign.service.js';
import { BrandService } from '../admin/services/brand.service.js';
import { InfluencerService } from '../admin/services/influencer.service.js';

/**
 * Controller para marcas
 * Rotas acessíveis apenas para usuários com role 'brand'
 */
@Controller('brand')
@UseGuards(RolesGuard)
export class BrandController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly brandService: BrandService,
    private readonly influencerService: InfluencerService,
  ) {}

  /**
   * Perfil completo de uma marca (acessível apenas por ORI)
   */
  @Get('profile/:id')
  @Roles(UserRole.ORI)
  async getProfile(@Param('id') brandId: string) {
    // Buscar perfil da marca
    const brandProfile = await this.brandService.findById(brandId);

    if (!brandProfile) {
      throw new Error('Marca não encontrada');
    }

    // Converter para objeto plano para acessar _id
    const profileData = (brandProfile as any).toObject
      ? (brandProfile as any).toObject()
      : brandProfile;

    // Buscar campanhas da marca
    const campaigns = await this.campaignService.findByBrandId(
      brandProfile.userId,
    );

    // Buscar influencers únicos vinculados às campanhas
    const influencerIds = new Set<string>();
    campaigns.forEach((campaign) => {
      campaign.assignedInfluencers?.forEach((influencerId) => {
        influencerIds.add(influencerId);
      });
    });

    // Buscar detalhes dos influencers
    const allInfluencers = await this.influencerService.findAll();
    const connectedInfluencers = allInfluencers.filter((inf) =>
      influencerIds.has(inf.userId),
    );

    // Mapear influencers com suas campanhas
    const influencersWithCampaigns = connectedInfluencers.map((influencer) => {
      const influencerCampaigns = campaigns.filter((campaign) =>
        campaign.assignedInfluencers?.includes(influencer.userId),
      );

      const influencerData = (influencer as any).toObject
        ? (influencer as any).toObject()
        : influencer;

      return {
        _id: influencerData._id,
        userId: influencer.userId,
        name: influencer.name,
        email: influencer.email,
        instagram: influencer.instagram,
        followers: influencer.followers,
        active: influencer.active,
        campaigns: influencerCampaigns.map((c) => ({
          name: c.name,
          status: c.status,
        })),
      };
    });

    return {
      message: 'Perfil da marca',
      profile: {
        _id: profileData._id,
        userId: brandProfile.userId,
        name: brandProfile.name,
        email: brandProfile.email,
        website: brandProfile.website,
        description: brandProfile.description,
        active: brandProfile.active,
      },
      stats: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
        connectedInfluencers: connectedInfluencers.length,
      },
      campaigns: campaigns.map((campaign) => ({
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        assignedInfluencers: campaign.assignedInfluencers?.length || 0,
      })),
      influencers: influencersWithCampaigns,
    };
  }

  /**
   * Dashboard da marca com estatísticas e dados completos
   */
  @Get('dashboard')
  @Roles(UserRole.BRAND)
  async getDashboard(@Req() req) {
    const userId = req.user?.id;

    console.log('🏢 [Brand Dashboard] Requisição recebida');
    console.log('   User ID:', userId);
    console.log('   User:', req.user);

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar perfil da marca
    const brandProfile = await this.brandService.findByUserId(userId);
    console.log('   Brand Profile encontrado:', brandProfile ? 'SIM' : 'NÃO');

    if (!brandProfile) {
      console.log('   ⚠️  Retornando dashboard vazio - Brand não encontrado');
      return {
        message: 'Dashboard da marca',
        profile: null,
        stats: {
          totalCampaigns: 0,
          activeCampaigns: 0,
          connectedInfluencers: 0,
        },
        campaigns: [],
        influencers: [],
      };
    }

    // Buscar todas as campanhas da marca
    const campaigns = await this.campaignService.findByBrandId(userId);
    const activeCampaigns = campaigns.filter((c) => c.status === 'active');
    console.log('   Campanhas encontradas:', campaigns.length);
    console.log('   Campanhas ativas:', activeCampaigns.length);

    // Buscar influencers únicos vinculados às campanhas
    const influencerIds = new Set<string>();
    campaigns.forEach((campaign) => {
      campaign.assignedInfluencers?.forEach((influencerId) => {
        influencerIds.add(influencerId);
      });
    });

    // Buscar detalhes dos influencers
    const allInfluencers = await this.influencerService.findAll();
    const connectedInfluencers = allInfluencers.filter((inf) =>
      influencerIds.has(inf.userId),
    );

    // Mapear influencers com suas campanhas
    const influencersWithCampaigns = connectedInfluencers.map((influencer) => {
      const influencerCampaigns = campaigns.filter((campaign) =>
        campaign.assignedInfluencers?.includes(influencer.userId),
      );

      const influencerData = (influencer as any).toObject
        ? (influencer as any).toObject()
        : influencer;

      return {
        _id: influencerData._id,
        userId: influencer.userId,
        name: influencer.name,
        email: influencer.email,
        instagram: influencer.instagram,
        followers: influencer.followers,
        active: influencer.active,
        campaigns: influencerCampaigns.map((c) => ({
          name: c.name,
          status: c.status,
        })),
      };
    });

    const response = {
      message: 'Dashboard da marca',
      profile: {
        name: brandProfile.name,
        email: brandProfile.email,
        website: brandProfile.website,
        description: brandProfile.description,
        active: brandProfile.active,
      },
      stats: {
        totalCampaigns: campaigns.length,
        activeCampaigns: activeCampaigns.length,
        connectedInfluencers: connectedInfluencers.length,
      },
      campaigns: campaigns.map((campaign) => ({
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        assignedInfluencers: campaign.assignedInfluencers?.length || 0,
      })),
      influencers: influencersWithCampaigns,
    };

    console.log('✅ [Brand Dashboard] Retornando dados:');
    console.log('   Stats:', response.stats);
    console.log('   Campaigns:', response.campaigns.length);
    console.log('   Influencers:', response.influencers.length);

    return response;
  }

  /**
   * Listar influencers vinculados às campanhas da marca
   */
  @Get('influencers')
  async getInfluencers(@Req() req) {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar perfil da marca
    const brandProfile = await this.brandService.findByUserId(userId);

    if (!brandProfile) {
      return {
        message: 'Lista de influencers vinculados',
        total: 0,
        data: [],
      };
    }

    // Buscar todas as campanhas da marca
    const campaigns = await this.campaignService.findByBrandId(userId);

    // Coletar IDs únicos de influencers vinculados
    const influencerIds = new Set<string>();
    campaigns.forEach((campaign) => {
      campaign.assignedInfluencers?.forEach((id) => {
        influencerIds.add(id);
      });
    });

    // Buscar os perfis dos influencers
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.DATABASE_URL!);
    await client.connect();
    const db = client.db();

    const influencers = await db
      .collection('influencers')
      .find({ userId: { $in: Array.from(influencerIds) } })
      .toArray();

    await client.close();

    return {
      message: 'Lista de influencers vinculados',
      total: influencers.length,
      data: influencers,
    };
  }

  /**
   * Listar todas as campanhas da marca
   * Acessível para BRAND (suas campanhas) e ORI (todas as campanhas)
   * Suporta filtro por brandId via query parameter
   */
  @Get('campaigns')
  @Roles(UserRole.BRAND, UserRole.ORI)
  async getCampaigns(@Req() req, @Query('brandId') brandId?: string) {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    let campaigns;

    // Se brandId foi fornecido (admin visualizando campanhas de uma marca específica)
    if (brandId && userRole === UserRole.ORI) {
      // Buscar a marca pelo ID
      const brand = await this.brandService.findById(brandId);

      if (!brand) {
        return {
          message: 'Marca não encontrada',
          total: 0,
          data: [],
        };
      }

      // Retornar campanhas dessa marca específica
      campaigns = await this.campaignService.findByBrandId(brand.userId);
    }
    // Se for ORI sem brandId, retorna todas as campanhas
    else if (userRole === UserRole.ORI) {
      campaigns = await this.campaignService.findAll();
    }
    // Se for BRAND, busca perfil e retorna apenas suas campanhas
    else {
      const brandProfile = await this.brandService.findByUserId(userId);

      if (!brandProfile) {
        return {
          message: 'Lista de campanhas',
          total: 0,
          data: [],
        };
      }

      campaigns = await this.campaignService.findByBrandId(userId);
    }

    // Adicionar contagem de influencers para cada campanha
    const campaignsWithCount = campaigns.map((campaign: any) => ({
      ...campaign,
      _id: campaign._id?.toString() || campaign._id,
      influencersCount: campaign.assignedInfluencers?.length || 0,
    }));

    return {
      message: 'Lista de campanhas',
      total: campaigns.length,
      data: campaignsWithCount,
    };
  }

  /**
   * Detalhes de uma campanha específica com influencers vinculados
   * Acessível para BRAND (suas campanhas) e ORI (todas as campanhas)
   */
  @Get('campaigns/:id')
  @Roles(UserRole.BRAND, UserRole.ORI)
  async getCampaignDetails(@Req() req, @Param('id') campaignId: string) {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar a campanha
    const campaign: any = await this.campaignService.findById(campaignId);

    if (!campaign) {
      return {
        message: 'Campanha não encontrada',
        data: null,
      };
    }

    // Verificar se a campanha pertence à marca logada (apenas para BRAND)
    // ORI pode acessar qualquer campanha
    if (userRole === UserRole.BRAND && campaign.brandId !== userId) {
      throw new Error('Acesso negado a esta campanha');
    }

    // Se não há influencers vinculados, retornar campanha sem influencers
    if (
      !campaign.assignedInfluencers ||
      campaign.assignedInfluencers.length === 0
    ) {
      return {
        message: 'Detalhes da campanha',
        data: {
          campaign: {
            ...campaign,
            _id: campaign._id?.toString() || campaign._id,
          },
          influencers: [],
        },
      };
    }

    // Buscar os perfis dos influencers vinculados
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.DATABASE_URL!);
    await client.connect();
    const db = client.db();

    const influencers = await db
      .collection('influencers')
      .find({ userId: { $in: campaign.assignedInfluencers } })
      .toArray();

    await client.close();

    return {
      message: 'Detalhes da campanha',
      data: {
        campaign: {
          ...campaign,
          _id: campaign._id?.toString() || campaign._id,
        },
        influencers,
      },
    };
  }
}
