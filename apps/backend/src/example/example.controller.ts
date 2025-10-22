import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/enums/user-role.enum';

/**
 * Controller de exemplos para demonstrar controle de acesso por roles
 * Use estas rotas como referência para implementar suas próprias rotas protegidas
 */
@Controller('example')
@UseGuards(RolesGuard)
export class ExampleController {
  // Rota acessível apenas para ORI (administrador)
  @Get('admin-only')
  @Roles(UserRole.ORI)
  adminOnly() {
    return {
      message: 'Esta rota é acessível apenas para administradores (ORI)',
      tip: 'Use o decorator @Roles(UserRole.ORI) para proteger rotas exclusivas de admin',
    };
  }

  // Rota acessível para BRAND e ORI
  @Get('brands-and-admin')
  @Roles(UserRole.BRAND, UserRole.ORI)
  brandsAndAdmin() {
    return {
      message: 'Esta rota é acessível para Brands e ORI',
      tip: 'Use @Roles(UserRole.BRAND, UserRole.ORI) para permitir múltiplos roles',
    };
  }

  // Rota acessível para INFLUENCER e ORI
  @Get('influencers-and-admin')
  @Roles(UserRole.INFLUENCER, UserRole.ORI)
  influencersAndAdmin() {
    return {
      message: 'Esta rota é acessível para Influencers e ORI',
      tip: 'Use @Roles(UserRole.INFLUENCER, UserRole.ORI) para influencers e admins',
    };
  }

  // Rota acessível para todos os usuários autenticados
  @Get('all-users')
  @Roles(UserRole.INFLUENCER, UserRole.BRAND, UserRole.ORI)
  allUsers() {
    return {
      message: 'Esta rota é acessível para todos os usuários autenticados',
      tip: 'Liste todos os roles disponíveis para permitir acesso geral',
    };
  }

  // Rota de teste de autenticação
  @Get('test-auth')
  @Roles(UserRole.INFLUENCER, UserRole.BRAND, UserRole.ORI)
  testAuth() {
    return {
      message: 'Autenticação funcionando corretamente!',
      info: 'Se você está vendo esta mensagem, seu token de autenticação é válido',
    };
  }
}
