import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

/**
 * Guard para prevenir que usuários se registrem como ORI (administrador)
 * Use este guard no endpoint de signup
 */
@Injectable()
export class PreventOriSignupGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // Verifica se está tentando registrar como ORI
    if (body.role === UserRole.ORI) {
      throw new ForbiddenException(
        'Não é permitido auto-registro como administrador. ' +
          'Entre em contato com o suporte para solicitar acesso administrativo.',
      );
    }

    return true;
  }
}
