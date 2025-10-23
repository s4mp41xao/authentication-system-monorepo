import { config } from 'dotenv';
config(); // load .env file contents into process.env

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { NestExpressApplication } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

// Create Express server for Vercel serverless
const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

// Create NestJS app instance
let app: NestExpressApplication;

async function createApp() {
  if (app) {
    return app;
  }

  app = await NestFactory.create<NestExpressApplication>(AppModule, adapter);

  // Enable CORS for frontend integration
  app.enableCors({
    origin:
      process.env.FRONTEND_URL ||
      process.env.VERCEL_URL ||
      'http://localhost:5173',
    credentials: true, // Importante para Better Auth (cookies/sessões)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
}

// For local development
async function bootstrap() {
  await createApp();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Aplicação rodando em http://localhost:${port}`);
  console.log(
    `🌐 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`,
  );
}

// Only run bootstrap in local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

// Export for Vercel serverless
export default async (req: Request, res: Response) => {
  await createApp();
  expressApp(req, res);
};
