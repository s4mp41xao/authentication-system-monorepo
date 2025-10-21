import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [AuthController],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class AuthModule {}
