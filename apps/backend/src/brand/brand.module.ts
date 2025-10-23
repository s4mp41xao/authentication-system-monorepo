import { Module, forwardRef } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AdminModule), forwardRef(() => AuthModule)],
  controllers: [BrandController],
})
export class BrandModule {}
