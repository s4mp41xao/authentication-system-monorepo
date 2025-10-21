import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { createAuth } from '../lib/auth';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { PreventOriSignupGuard } from './guards/prevent-ori-signup.guard';

@Controller('auth')
export class AuthController {
  @Post('signup')
  @UseGuards(PreventOriSignupGuard) // Previne auto-registro como ORI
  async register(@Body() signupDto: SignupDto, @Res() res) {
    const auth = await createAuth();
    const result = await auth.api.signUpEmail({
      body: {
        email: signupDto.email,
        password: signupDto.password,
        name: signupDto.name,
        role: signupDto.role, // Incluindo o role
        callbackURL: '/dashboard',
      },
    });
    return res.json(result);
  }

  @Post('signin')
  async login(@Body() signinDto: SigninDto, @Req() req, @Res() res) {
    const auth = await createAuth();
    const result = await auth.api.signInEmail({
      body: {
        email: signinDto.email,
        password: signinDto.password,
      },
      headers: req.headers,
    });
    return res.json(result);
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
