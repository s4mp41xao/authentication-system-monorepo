import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/enums/user-role.enum';
import { CampaignService } from '../admin/services/campaign.service';
import { InfluencerService } from '../admin/services/influencer.service';

/**
 * Controller para influencers
 * Rotas acessíveis apenas para usuários com role 'influencer'
 */
@Controller('influencer')
@UseGuards(RolesGuard)
export class InfluencerController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly influencerService: InfluencerService,
  ) {}

  /**
   * Perfil completo de um influencer (acessível por ORI, BRAND e próprio INFLUENCER)
   */
  @Get('profile/:id')
  @Roles(UserRole.ORI, UserRole.BRAND, UserRole.INFLUENCER)
  async getProfile(@Param('id') influencerId: string, @Req() req) {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar perfil do influencer
    const influencerProfile =
      await this.influencerService.findById(influencerId);

    if (!influencerProfile) {
      throw new Error('Influencer não encontrado');
    }

    // Converter para objeto plano para acessar _id
    const profileData = (influencerProfile as any).toObject
      ? (influencerProfile as any).toObject()
      : influencerProfile;

    // Se for INFLUENCER, permitir apenas visualizar o próprio perfil
    if (
      userRole === UserRole.INFLUENCER &&
      influencerProfile.userId !== userId
    ) {
      throw new Error('Você não tem permissão para visualizar este perfil');
    }

    // Buscar todas as campanhas do sistema
    const allCampaigns = await this.campaignService.findAll();

    // Filtrar campanhas onde o influencer está vinculado
    const assignedCampaigns = allCampaigns.filter((campaign) =>
      campaign.assignedInfluencers?.includes(influencerProfile.userId),
    );

    return {
      message: 'Perfil do influencer',
      profile: {
        _id: profileData._id,
        userId: influencerProfile.userId,
        name: influencerProfile.name,
        email: influencerProfile.email,
        instagram: influencerProfile.instagram,
        tiktok: influencerProfile.tiktok,
        youtube: influencerProfile.youtube,
        followers: influencerProfile.followers,
        bio: influencerProfile.bio,
      },
      stats: {
        assignedCampaigns: assignedCampaigns.length,
        campaigns: assignedCampaigns.map((campaign) => ({
          name: campaign.name,
          budget: campaign.budget,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          status: campaign.status,
        })),
      },
    };
  }

  /**
   * Dashboard do influencer com informações do perfil e estatísticas
   */
  @Get('dashboard')
  @Roles(UserRole.INFLUENCER)
  async getDashboard(@Req() req) {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Log detalhado para debug
    console.log('📊 Requisição ao dashboard do influencer:');
    console.log('   User ID:', userId);
    console.log('   User Role:', userRole);
    console.log('   User Email:', req.user?.email);
    console.log('   User completo:', JSON.stringify(req.user, null, 2));

    if (!userId) {
      console.log('❌ Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    // Buscar perfil do influencer
    const influencerProfile = await this.influencerService.findByUserId(userId);

    console.log(
      '   Perfil encontrado?',
      influencerProfile ? '✅ Sim' : '❌ Não',
    );
    if (influencerProfile) {
      console.log('   Nome do perfil:', influencerProfile.name);
    }

    if (!influencerProfile) {
      console.log(
        '⚠️ Perfil de influencer não encontrado para userId:',
        userId,
      );
      return {
        message: 'Dashboard do influencer',
        profile: null,
        stats: {
          assignedCampaigns: 0,
        },
      };
    }

    // Buscar todas as campanhas do sistema
    const allCampaigns = await this.campaignService.findAll();

    // Filtrar campanhas onde o influencer está vinculado
    const assignedCampaigns = allCampaigns.filter((campaign) =>
      campaign.assignedInfluencers?.includes(userId),
    );

    return {
      message: 'Dashboard do influencer',
      profile: {
        name: influencerProfile.name,
        email: influencerProfile.email,
        instagram: influencerProfile.instagram,
        tiktok: influencerProfile.tiktok,
        youtube: influencerProfile.youtube,
        followers: influencerProfile.followers,
        bio: influencerProfile.bio,
      },
      stats: {
        assignedCampaigns: assignedCampaigns.length,
      },
    };
  }

  /**
   * Listar campanhas vinculadas ao influencer
   */
  @Get('campaigns')
  async getCampaigns(@Req() req) {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar perfil do influencer
    const influencerProfile = await this.influencerService.findByUserId(userId);

    if (!influencerProfile) {
      return {
        message: 'Lista de campanhas',
        total: 0,
        data: [],
      };
    }

    // Buscar todas as campanhas do sistema
    const allCampaigns = await this.campaignService.findAll();

    // Filtrar campanhas onde o influencer está vinculado
    const assignedCampaigns = allCampaigns.filter((campaign) =>
      campaign.assignedInfluencers?.includes(userId),
    );

    // Buscar informações das marcas para cada campanha
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.DATABASE_URL!);
    await client.connect();
    const db = client.db();

    const campaignsWithBrand = await Promise.all(
      assignedCampaigns.map(async (campaign: any) => {
        const brand = await db
          .collection('brands')
          .findOne({ userId: campaign.brandId });

        return {
          _id: campaign._id?.toString() || campaign._id,
          name: campaign.name,
          description: campaign.description,
          brandId: campaign.brandId,
          brandName: brand?.name || 'Marca não encontrada',
          budget: campaign.budget,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          status: campaign.status,
          assignedInfluencers: campaign.assignedInfluencers,
        };
      }),
    );

    await client.close();

    return {
      message: 'Lista de campanhas vinculadas',
      total: campaignsWithBrand.length,
      data: campaignsWithBrand,
    };
  }
}
