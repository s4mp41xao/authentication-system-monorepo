import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug/session')
  debugSession(@Req() req): any {
    return {
      message: 'Debug de sessão',
      user: req.user || null,
      hasUser: !!req.user,
      cookies: req.headers.cookie || 'NENHUM',
      headers: {
        cookie: req.headers.cookie,
        authorization: req.headers.authorization,
      },
    };
  }
}
