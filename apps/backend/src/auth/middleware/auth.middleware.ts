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
      console.log('🔐 AuthMiddleware - Verificando autenticação');
      console.log('   Method:', req.method);
      console.log('   URL:', req.url);
      console.log('   Path:', req.path);
      console.log('   Original URL:', req.originalUrl);
      console.log('   Cookies recebidos:', req.headers.cookie || 'NENHUM');
      console.log('   Origin:', req.headers.origin);
      console.log('   Referer:', req.headers.referer);

      const auth = await createAuth();

      // Extrair token do Authorization header OU cookie
      let token: string | null = null;
      
      // Prioridade 1: Authorization header (para cross-origin)
      if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7);
        console.log('   Token encontrado no Authorization header:', token.substring(0, 10) + '...');
      }
      // Prioridade 2: Cookie (para same-origin)
      else if (req.headers.cookie?.includes('better-auth.session_token=')) {
        const tokenMatch = req.headers.cookie.match(
          /better-auth\.session_token=([^;]+)/,
        );
        if (tokenMatch) {
          token = tokenMatch[1];
          console.log('   Token encontrado:', token.substring(0, 10) + '...');
        }
      } else {
        console.log(
          '   ⚠️  Cookie "better-auth.session_token" NÃO encontrado!',
        );
      }

      // Verificar cache primeiro (DESABILITADO TEMPORARIAMENTE PARA DEBUG)
      /*
      if (token && sessionCache.has(token)) {
        const cached = sessionCache.get(token)!;
        if (cached.expires > Date.now()) {
          console.log('⚡ Usando sessão do cache para:', cached.user.email);
          (req as any).user = cached.user;
          return next();
        } else {
          // Cache expirado, remover
          sessionCache.delete(token);
        }
      }
      */

      console.log('🔍 Verificando sessão no Better Auth...');

      // Better Auth precisa do request completo para verificar a sessão
      const session = await auth.api.getSession({
        headers: req.headers as any,
        cookie: req.headers.cookie,
      });

      if (session?.user) {
        console.log(
          '✅ Sessão Better Auth encontrada:',
          session.user?.email,
          'Role:',
          session.user?.role,
        );
        (req as any).user = session.user;

        // Adicionar ao cache (DESABILITADO)
        /*
        if (token) {
          sessionCache.set(token, {
            user: session.user,
            expires: Date.now() + CACHE_DURATION,
          });
        }
        */
      } else {
        console.log('⚠️  Better Auth NÃO retornou sessão');
        // Fallback: Buscar diretamente no banco
        if (token) {
          console.log('🔍 Fallback: buscando sessão diretamente no MongoDB...');

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

                console.log(
                  '✅ Usuário encontrado no MongoDB:',
                  user.email,
                  'Role:',
                  user.role,
                );
                (req as any).user = user;

                // Adicionar ao cache (DESABILITADO)
                /*
                sessionCache.set(token, {
                  user,
                  expires: Date.now() + CACHE_DURATION,
                });
                */
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
