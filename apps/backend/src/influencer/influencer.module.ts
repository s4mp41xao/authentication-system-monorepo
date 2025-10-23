import { Module, forwardRef } from '@nestjs/common';
import { InfluencerController } from './influencer.controller.js';
import { AdminModule } from '../admin/admin.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [forwardRef(() => AdminModule), forwardRef(() => AuthModule)],
  controllers: [InfluencerController],
})
export class InfluencerModule {}
