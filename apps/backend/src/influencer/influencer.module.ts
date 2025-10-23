import { Module, forwardRef } from '@nestjs/common';
import { InfluencerController } from './influencer.controller';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AdminModule), forwardRef(() => AuthModule)],
  controllers: [InfluencerController],
})
export class InfluencerModule {}
