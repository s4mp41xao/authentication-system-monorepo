import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Logs apenas em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔐 RolesGuard - Verificando acesso:');
      console.log('   Roles requeridos:', requiredRoles);
      console.log('   Usuário:', user?.email);
      console.log('   Role do usuário:', user?.role);
    }

    if (!user || !user.role) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('   ❌ Acesso negado: usuário ou role ausente');
      }
      return false;
    }

    // Comparação case-insensitive (normalizar para lowercase)
    const userRole = user.role.toLowerCase();
    const hasAccess = requiredRoles.some(
      (role) => userRole === role.toLowerCase(),
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log('   Role normalizado:', userRole);
      console.log('   Roles requeridos normalizados:', requiredRoles.map(r => r.toLowerCase()));
      console.log('   Tem acesso?', hasAccess ? '✅ Sim' : '❌ Não');
    }

    return hasAccess;
  }
}
