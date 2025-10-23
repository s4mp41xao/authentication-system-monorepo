import { Module, forwardRef } from '@nestjs/common';
import { BrandController } from './brand.controller.js';
import { AdminModule } from '../admin/admin.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [forwardRef(() => AdminModule), forwardRef(() => AuthModule)],
  controllers: [BrandController],
})
export class BrandModule {}
