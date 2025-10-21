import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/enums/user-role.enum';

@Controller('example')
@UseGuards(RolesGuard) // Aplica o guard a todas as rotas deste controller
export class ExampleController {
  // Rota acessível apenas para ORI (administrador)
  @Get('admin-only')
  @Roles(UserRole.ORI)
  adminOnly() {
    return {
      message: 'Esta rota é acessível apenas para administradores (ORI)',
    };
  }

  // Rota acessível para BRAND e ORI
  @Get('brands-and-admin')
  @Roles(UserRole.BRAND, UserRole.ORI)
  brandsAndAdmin() {
    return {
      message: 'Esta rota é acessível para Brands e ORI',
    };
  }

  // Rota acessível para INFLUENCER e ORI
  @Get('influencers-and-admin')
  @Roles(UserRole.INFLUENCER, UserRole.ORI)
  influencersAndAdmin() {
    return {
      message: 'Esta rota é acessível para Influencers e ORI',
    };
  }

  // Rota acessível para todos os usuários autenticados
  @Get('all-users')
  @Roles(UserRole.INFLUENCER, UserRole.BRAND, UserRole.ORI)
  allUsers() {
    return {
      message: 'Esta rota é acessível para todos os usuários autenticados',
    };
  }
}
