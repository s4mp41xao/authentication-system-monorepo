import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { createAuth } from '../lib/auth';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { PreventOriSignupGuard } from './guards/prevent-ori-signup.guard';
import { UserRole } from './enums/user-role.enum';
import { InfluencerService } from '../admin/services/influencer.service';
import { BrandService } from '../admin/services/brand.service';

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
      });

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
          console.log('✅ Perfil de influencer criado para:', signupDto.email, 'ID:', (profile as any)._id);
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
          console.log('✅ Perfil de marca criado para:', signupDto.email, 'ID:', (profile as any)._id);
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
      
      // Criar um objeto Request fake para o signin interno
      const signinResult = await auth.api.signInEmail({
        body: {
          email: signupDto.email,
          password: signupDto.password,
        },
        headers: req.headers as any,
        asResponse: true, // Força retornar como Response com headers
      });

      console.log('✅ Signin automático executado:', {
        status: signinResult.status,
        hasBody: !!signinResult.body,
      });

      // Extrair o corpo da resposta
      let signinData;
      try {
        const responseText = await signinResult.text();
        signinData = JSON.parse(responseText);
        console.log('✅ Dados do signin:', {
          hasSession: !!signinData.session,
          sessionToken: signinData.session?.token ? '✅ Present' : '❌ Missing',
        });
      } catch (e) {
        console.error('❌ Erro ao parsear resposta do signin:', e);
        signinData = {};
      }

      // Copiar cookies da resposta do signin para a resposta atual
      const setCookieHeaders = signinResult.headers.getSetCookie ? 
        signinResult.headers.getSetCookie() : 
        signinResult.headers.get('set-cookie');
      
      if (setCookieHeaders) {
        console.log('🍪 Copiando cookies do signin para a resposta');
        if (Array.isArray(setCookieHeaders)) {
          setCookieHeaders.forEach(cookie => res.append('Set-Cookie', cookie));
        } else {
          res.setHeader('Set-Cookie', setCookieHeaders);
        }
      }

      // Usar o resultado do signin ao invés do signup para ter a sessão
      const finalResult = signinData;

      // Buscar o usuário completo do MongoDB para garantir que o role está presente
      let userWithRole = finalResult.user;
      if (finalResult?.user?.id) {
        const { MongoClient, ObjectId } = await import('mongodb');
        const client = new MongoClient(process.env.DATABASE_URL!);
        await client.connect();
        const db = client.db();

        console.log('🔍 Buscando usuário recém-criado com ID:', finalResult.user.id);

        // Tentar buscar de várias formas
        let userDoc = await db.collection('user').findOne({ id: finalResult.user.id });

        if (!userDoc) {
          console.log('🔍 Tentando com _id como string...');
          userDoc = await db.collection('user').findOne({ _id: finalResult.user.id });
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
      if (finalResult.session) {
        res.cookie('better-auth.session_token', finalResult.session.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
        });
        console.log('🍪 Cookie de sessão definido:', finalResult.session.token);
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
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
