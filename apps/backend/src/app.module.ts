import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthMiddleware } from './auth/middleware/auth.middleware.js';
import { AdminModule } from './admin/admin.module.js';
import { BrandModule } from './brand/brand.module.js';
import { InfluencerModule } from './influencer/influencer.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    BrandModule,
    InfluencerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplica o middleware de autenticação em todas as rotas
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
