import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createAuth } from '../../lib/auth.js';

// Cache simples para sessões (válido por 5 minutos)
const sessionCache = new Map<string, { user: any; expires: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = await createAuth();

      // Extrair token do cookie primeiro
      let token: string | null = null;
      if (req.headers.cookie?.includes('better-auth.session_token=')) {
        const tokenMatch = req.headers.cookie.match(
          /better-auth\.session_token=([^;]+)/,
        );
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }

      // Verificar cache primeiro
      if (token && sessionCache.has(token)) {
        const cached = sessionCache.get(token)!;
        if (cached.expires > Date.now()) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('⚡ Usando sessão do cache');
          }
          (req as any).user = cached.user;
          return next();
        } else {
          // Cache expirado, remover
          sessionCache.delete(token);
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log('🔍 Verificando sessão (sem cache)');
      }

      // Better Auth precisa do request completo para verificar a sessão
      const session = await auth.api.getSession({
        headers: req.headers as any,
        cookie: req.headers.cookie,
      });

      if (session?.user) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(
            '✅ Sessão Better Auth:',
            session.user?.email,
            'Role:',
            session.user?.role,
          );
        }
        (req as any).user = session.user;

        // Adicionar ao cache
        if (token) {
          sessionCache.set(token, {
            user: session.user,
            expires: Date.now() + CACHE_DURATION,
          });
        }
      } else {
        // Fallback: Buscar diretamente no banco
        if (token) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('🔍 Fallback: buscando no MongoDB');
          }

          try {
            const { MongoClient, ObjectId } = await import('mongodb');
            const client = new MongoClient(process.env.DATABASE_URL!);
            await client.connect();

            const db = client.db();
            const sessionDoc = await db
              .collection('session')
              .findOne({ token });

            if (sessionDoc && sessionDoc.userId) {
              const userId =
                typeof sessionDoc.userId === 'string'
                  ? new ObjectId(sessionDoc.userId)
                  : sessionDoc.userId;

              const userDoc = await db
                .collection('user')
                .findOne({ _id: userId });

              if (userDoc) {
                const user = {
                  id: userDoc._id.toString(),
                  email: userDoc.email,
                  role: userDoc.role,
                  name: userDoc.name,
                };

                if (process.env.NODE_ENV !== 'production') {
                  console.log(
                    '✅ Usuário do MongoDB:',
                    user.email,
                    'Role:',
                    user.role,
                  );
                }
                (req as any).user = user;

                // Adicionar ao cache
                sessionCache.set(token, {
                  user,
                  expires: Date.now() + CACHE_DURATION,
                });
              }
            }

            await client.close();
          } catch (dbError) {
            console.error('❌ Erro ao buscar no banco:', dbError);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar sessão:', error);
    }

    next();
  }
}
