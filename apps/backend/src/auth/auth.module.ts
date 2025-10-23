import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [AuthController],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class AuthModule {}
