import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { RolesGuard } from './guards/roles.guard.js';
import { AdminModule } from '../admin/admin.module.js';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [AuthController],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class AuthModule {}
