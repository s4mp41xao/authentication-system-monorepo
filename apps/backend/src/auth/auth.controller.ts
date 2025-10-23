import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { createAuth } from '../lib/auth.js';
import { SignupDto } from './dto/signup.dto.js';
import { SigninDto } from './dto/signin.dto.js';
import { PreventOriSignupGuard } from './guards/prevent-ori-signup.guard.js';
import { UserRole } from './enums/user-role.enum.js';
import { InfluencerService } from '../admin/services/influencer.service.js';
import { BrandService } from '../admin/services/brand.service.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly influencerService: InfluencerService,
    private readonly brandService: BrandService,
  ) {}

  @Post('signup')
  @UseGuards(PreventOriSignupGuard) // Previne auto-registro como ORI
  async register(@Body() signupDto: SignupDto, @Req() req, @Res() res) {
    const auth = await createAuth();

    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: signupDto.email,
          password: signupDto.password,
          name: signupDto.name,
          role: signupDto.role, // Incluindo o role
          callbackURL: '/dashboard',
        },
      });

      console.log('📦 Resultado do signUpEmail:', {
        userId: result.user?.id,
        hasSession: !!result.session,
        sessionToken: result.session?.token ? '✅ Present' : '❌ Missing',
        userRole: result.user?.role,
      });

      // GARANTIR que o role seja salvo no MongoDB
      const { MongoClient, ObjectId } = await import('mongodb');
      const tempClient = new MongoClient(process.env.DATABASE_URL!);
      await tempClient.connect();
      const tempDb = tempClient.db();

      // Atualizar o usuário com o role
      await tempDb
        .collection('user')
        .updateOne(
          { _id: new ObjectId(result.user.id) },
          { $set: { role: signupDto.role } },
        );

      // Verificar se foi salvo
      const createdUser = await tempDb
        .collection('user')
        .findOne({ _id: new ObjectId(result.user.id) });
      console.log('🔍 Usuário criado/atualizado no MongoDB:', {
        id: createdUser?._id,
        email: createdUser?.email,
        role: createdUser?.role,
        hasRole: !!createdUser?.role,
      });
      await tempClient.close();

      // Criar perfil automaticamente baseado no role
      try {
        if (signupDto.role === UserRole.INFLUENCER) {
          const profile = await this.influencerService.create({
            userId: result.user.id,
            name: signupDto.name,
            email: signupDto.email,
            bio: signupDto.bio || '',
            instagram: signupDto.instagram || '',
            tiktok: '',
            youtube: '',
            followers: signupDto.followers || 0,
            active: true,
          });
          console.log(
            '✅ Perfil de influencer criado para:',
            signupDto.email,
            'ID:',
            (profile as any)._id,
          );
        } else if (signupDto.role === UserRole.BRAND) {
          const profile = await this.brandService.create({
            userId: result.user.id,
            name: signupDto.name,
            email: signupDto.email,
            description: signupDto.description || '',
            website: signupDto.website || '',
            industry: signupDto.industry || '',
            active: true,
          });
          console.log(
            '✅ Perfil de marca criado para:',
            signupDto.email,
            'ID:',
            (profile as any)._id,
          );
        }
      } catch (profileError) {
        console.error('❌ Erro ao criar perfil:', profileError);
        console.error('❌ Detalhes do erro:', profileError.message);
        console.error('❌ Stack:', profileError.stack);
        // Continua o signup mesmo se der erro ao criar perfil
      }

      // Better Auth não cria sessão automaticamente no signup
      // Fazer signin automático para criar a sessão
      console.log('🔐 Fazendo signin automático após signup...');

      // Fazer signin COM contexto de request/response para criar sessão
      const signinData = await auth.api.signInEmail({
        body: {
          email: signupDto.email,
          password: signupDto.password,
        },
        headers: req.headers as any,
        asResponse: false, // Queremos os dados, não a Response
      });

      console.log('✅ Signin automático executado:', {
        hasSession: !!signinData.session,
        hasToken: !!signinData.token,
        sessionToken:
          signinData.session?.token || signinData.token || '❌ Missing',
        userId: signinData.user?.id,
      });

      // Se não criou sessão, tentar criar manualmente
      if (!signinData.session && !signinData.token) {
        console.log(
          '⚠️  Signin não criou sessão, tentando criar manualmente...',
        );

        // Criar sessão diretamente no MongoDB
        const { MongoClient } = await import('mongodb');
        const { randomBytes } = await import('crypto');

        const sessionToken = randomBytes(32).toString('base64url');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

        const tempClient = new MongoClient(process.env.DATABASE_URL!);
        await tempClient.connect();
        const tempDb = tempClient.db();

        await tempDb.collection('session').insertOne({
          token: sessionToken,
          userId: result.user.id,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log('✅ Sessão manual criada:', sessionToken);

        // Adicionar o token ao resultado
        signinData.token = sessionToken;
        signinData.session = {
          token: sessionToken,
          userId: result.user.id,
          expiresAt,
        };

        await tempClient.close();
      }

      // Verificar se a sessão foi criada no MongoDB
      if (signinData.session?.token || signinData.token) {
        const sessionToken = signinData.session?.token || signinData.token;
        const { MongoClient } = await import('mongodb');
        const tempClient = new MongoClient(process.env.DATABASE_URL!);
        await tempClient.connect();
        const tempDb = tempClient.db();

        const sessionDoc = await tempDb
          .collection('session')
          .findOne({ token: sessionToken });
        console.log('🔍 Sessão no MongoDB após signin:', {
          exists: !!sessionDoc,
          token: sessionDoc?.token,
          userId: sessionDoc?.userId,
          expiresAt: sessionDoc?.expiresAt,
        });

        await tempClient.close();
      }

      // Usar o resultado do signin
      const finalResult = signinData;

      // Buscar o usuário completo do MongoDB para garantir que o role está presente
      let userWithRole = finalResult.user;
      if (finalResult?.user?.id) {
        const { MongoClient, ObjectId } = await import('mongodb');
        const client = new MongoClient(process.env.DATABASE_URL!);
        await client.connect();
        const db = client.db();

        console.log(
          '🔍 Buscando usuário recém-criado com ID:',
          finalResult.user.id,
        );

        // Tentar buscar de várias formas
        let userDoc = await db
          .collection('user')
          .findOne({ id: finalResult.user.id });

        if (!userDoc) {
          console.log('🔍 Tentando com _id como string...');
          userDoc = await db
            .collection('user')
            .findOne({ _id: finalResult.user.id });
        }

        if (!userDoc) {
          console.log('🔍 Tentando com _id como ObjectId...');
          try {
            userDoc = await db
              .collection('user')
              .findOne({ _id: new ObjectId(finalResult.user.id) });
          } catch (e) {
            console.log('❌ Não foi possível converter para ObjectId');
          }
        }

        if (!userDoc) {
          console.log('🔍 Tentando buscar por email...');
          userDoc = await db
            .collection('user')
            .findOne({ email: signupDto.email });
        }

        await client.close();

        console.log(
          '📦 UserDoc encontrado após signup:',
          userDoc
            ? {
                _id: userDoc._id,
                id: userDoc.id,
                email: userDoc.email,
                role: userDoc.role,
                name: userDoc.name,
              }
            : 'não encontrado',
        );

        if (userDoc) {
          userWithRole = {
            ...finalResult.user,
            role: userDoc.role,
            name: userDoc.name,
          };
        }
      }

      console.log('✅ Signup bem-sucedido:', {
        userId: userWithRole?.id,
        email: userWithRole?.email,
        role: userWithRole?.role,
      });

      // Retornar resultado do signin (com sessão) mas com user completo
      const responseData = {
        ...finalResult,
        user: userWithRole,
      };

      // Garantir que os cookies sejam enviados corretamente
      const sessionToken = finalResult.session?.token || finalResult.token;
      if (sessionToken) {
        res.cookie('better-auth.session_token', sessionToken, {
          httpOnly: true,
          secure: true, // SEMPRE true para sameSite=none
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' para cross-origin em produção
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
          path: '/',
        });
        console.log('🍪 Cookie de sessão definido:', sessionToken);
        console.log('🍪 Configuração do cookie:', {
          httpOnly: true,
          secure: true,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          path: '/',
          NODE_ENV: process.env.NODE_ENV
        });
      } else {
        console.error(
          '❌ ERRO: Nenhum token de sessão disponível para definir cookie!',
        );
      }

      return res.json(responseData);
    } catch (error) {
      console.error('❌ Erro no signup:', error);
      throw error;
    }
  }

  @Post('signin')
  async login(@Body() signinDto: SigninDto, @Req() req, @Res() res) {
    const auth = await createAuth();

    console.log('🔐 Tentando fazer login com:', signinDto.email);

    const result = await auth.api.signInEmail({
      body: {
        email: signinDto.email,
        password: signinDto.password,
      },
      headers: req.headers,
    });

    // Buscar dados completos do usuário no MongoDB
    let userWithRole = result?.user;
    if (result?.user?.id) {
      const { MongoClient, ObjectId } = await import('mongodb');
      const client = new MongoClient(process.env.DATABASE_URL!);
      await client.connect();
      const db = client.db();

      console.log('🔍 Buscando usuário com ID:', result.user.id);

      // Tentar múltiplas formas de buscar
      let userDoc = await db.collection('user').findOne({ id: result.user.id });

      if (!userDoc) {
        console.log('🔍 Tentando com _id como string...');
        userDoc = await db.collection('user').findOne({ _id: result.user.id });
      }

      if (!userDoc) {
        console.log('🔍 Tentando com _id como ObjectId...');
        try {
          userDoc = await db
            .collection('user')
            .findOne({ _id: new ObjectId(result.user.id) });
        } catch (e) {
          console.log('❌ Não foi possível converter para ObjectId');
        }
      }

      if (!userDoc) {
        console.log('🔍 Tentando buscar por email...');
        userDoc = await db
          .collection('user')
          .findOne({ email: signinDto.email });
      }

      await client.close();

      console.log(
        '📦 UserDoc encontrado:',
        userDoc
          ? {
              _id: userDoc._id,
              id: userDoc.id,
              email: userDoc.email,
              role: userDoc.role,
              name: userDoc.name,
            }
          : 'não encontrado',
      );

      if (userDoc) {
        userWithRole = {
          ...result.user,
          role: userDoc.role,
          name: userDoc.name,
        };
      }
    }

    console.log('✅ Login bem-sucedido:', {
      userId: userWithRole?.id,
      email: userWithRole?.email,
      role: userWithRole?.role,
      token: result?.token ? 'presente' : 'ausente',
    });

    // Se o Better Auth retornou um cookie, definir explicitamente
    if (result?.token) {
      console.log('🍪 Definindo cookie com token:', result.token);
      res.cookie('better-auth.session_token', result.token, {
        httpOnly: true,
        secure: true, // SEMPRE true para sameSite=none
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' para cross-origin em produção
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
      });
    }

    return res.json({ ...result, user: userWithRole });
  }

  @Post('signout')
  async logout(@Req() req, @Res() res) {
    const auth = await createAuth();

    try {
      // Better Auth signOut precisa de headers e body (mesmo que vazio)
      const result = await auth.api.signOut({
        headers: req.headers,
        body: {}, // Objeto vazio
      });

      // Limpar o cookie de sessão
      res.clearCookie('better-auth.session_token');

      return res.json({ success: true, ...result });
    } catch (error) {
      console.error('Erro no logout:', error);

      // Mesmo com erro, limpar o cookie no cliente
      res.clearCookie('better-auth.session_token');
      return res
        .status(200)
        .json({ success: true, message: 'Sessão encerrada' });
    }
  }
}
