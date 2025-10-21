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
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/enums/user-role.enum';
import { SignupDto } from '../auth/dto/signup.dto';
import { createAuth } from '../lib/auth';

/**
 * Controller de administração
 * Todas as rotas são protegidas e acessíveis apenas para ORI (administradores)
 */
@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.ORI)
export class AdminController {
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
   * Dashboard administrativo
   */
  @Get('dashboard')
  async getDashboard() {
    return {
      message: 'Dashboard administrativo',
      stats: {
        totalUsers: 0, // Implementar contagem real
        totalInfluencers: 0,
        totalBrands: 0,
        totalAdmins: 0,
      },
    };
  }
}
