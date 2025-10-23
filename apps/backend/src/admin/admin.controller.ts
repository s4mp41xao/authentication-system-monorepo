import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../auth/enums/user-role.enum.js';
import { SignupDto } from '../auth/dto/signup.dto.js';
import { createAuth } from '../lib/auth.js';
import { InfluencerService } from './services/influencer.service.js';
import { BrandService } from './services/brand.service.js';
import { CampaignService } from './services/campaign.service.js';
import { CreateCampaignDto } from './dto/create-campaign.dto.js';

/**
 * Controller de administração
 * Todas as rotas são protegidas e acessíveis apenas para ORI (administradores)
 */
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ORI)
export class AdminController {
  constructor(
    private readonly influencerService: InfluencerService,
    private readonly brandService: BrandService,
    private readonly campaignService: CampaignService,
  ) {}

  /**
   * Cria um novo usuário com qualquer role (incluindo ORI)
   * Apenas administradores podem criar outros administradores
   */
  @Post('users')
  async createUser(@Body() signupDto: SignupDto) {
    const auth = await createAuth();
    const result = await auth.api.signUpEmail({
      body: {
        email: signupDto.email,
        password: signupDto.password,
        name: signupDto.name,
        role: signupDto.role,
        callbackURL: '/dashboard',
      },
    });
    return {
      message: 'Usuário criado com sucesso',
      user: result,
    };
  }

  /**
   * Lista todos os usuários (exemplo)
   * Em produção, você implementaria a lógica real aqui
   */
  @Get('users')
  async listUsers() {
    return {
      message: 'Lista de usuários',
      // Aqui você implementaria a lógica para buscar do banco
    };
  }

  /**
   * Atualiza o role de um usuário (exemplo)
   */
  @Patch('users/:id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return {
      message: `Role do usuário ${id} atualizado para ${role}`,
      // Aqui você implementaria a lógica real de atualização
    };
  }

  /**
   * Remove um usuário (exemplo)
   */
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return {
      message: `Usuário ${id} removido com sucesso`,
      // Aqui você implementaria a lógica real de remoção
    };
  }

  /**
   * Dashboard administrativo com estatísticas
   * Exibe: campanhas ativas, influencers registrados e marcas registradas
   */
  @Get('dashboard')
  async getDashboard() {
    const [activeCampaigns, totalInfluencers, totalBrands] = await Promise.all([
      this.campaignService.countActive(),
      this.influencerService.count(),
      this.brandService.count(),
    ]);

    return {
      message: 'Dashboard administrativo',
      stats: {
        activeCampaigns,
        totalInfluencers,
        totalBrands,
      },
    };
  }

  /**
   * Lista todos os influencers registrados
   * Rota exclusiva para ORI
   */
  @Get('influencers')
  async listInfluencers() {
    const influencers = await this.influencerService.findAll();
    return {
      message: 'Lista de todos os influencers registrados',
      total: influencers.length,
      data: influencers,
    };
  }

  /**
   * Lista todas as marcas registradas
   * Rota exclusiva para ORI
   */
  @Get('brands')
  async listBrands() {
    const brands = await this.brandService.findAll();
    return {
      message: 'Lista de todas as marcas registradas',
      total: brands.length,
      data: brands,
    };
  }

  /**
   * Lista todas as campanhas ativas
   * Rota exclusiva para ORI
   */
  @Get('campaigns')
  async listCampaigns() {
    const campaigns = await this.campaignService.findActive();
    return {
      message: 'Lista de todas as campanhas ativas',
      total: campaigns.length,
      data: campaigns,
      note: 'Funcionalidade de atribuir campanhas a influencers será implementada em breve',
    };
  }

  /**
   * Detalhes de uma campanha específica
   */
  @Get('campaigns/:id')
  async getCampaignDetails(@Param('id') id: string) {
    const campaign = await this.campaignService.findById(id);
    if (!campaign) {
      return {
        message: 'Campanha não encontrada',
        data: null,
      };
    }
    return {
      message: 'Detalhes da campanha',
      data: campaign,
    };
  }

  /**
   * Cria uma nova campanha
   */
  @Post('campaigns')
  async createCampaign(@Body() campaignData: CreateCampaignDto) {
    const campaign = await this.campaignService.create(campaignData);
    return {
      message: 'Campanha criada com sucesso',
      data: campaign,
    };
  }

  /**
   * Atribui um influencer a uma campanha
   * (Funcionalidade preparada para implementação futura)
   */
  @Post('campaigns/:campaignId/assign/:influencerId')
  async assignInfluencerToCampaign(
    @Param('campaignId') campaignId: string,
    @Param('influencerId') influencerId: string,
  ) {
    const campaign = await this.campaignService.assignInfluencer(
      campaignId,
      influencerId,
    );
    return {
      message: 'Influencer atribuído à campanha com sucesso',
      data: campaign,
    };
  }
}
