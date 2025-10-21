import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createAuth } from '../../lib/auth';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = await createAuth();

      // Better Auth verifica a sessão automaticamente através dos cookies/headers
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (session) {
        // Adiciona o usuário no request para uso posterior
        (req as any).user = session.user;
      }
    } catch (error) {
      // Se falhar, apenas continua sem usuário (rotas públicas ainda funcionam)
      console.error('Erro ao verificar sessão:', error);
    }

    next();
  }
}
