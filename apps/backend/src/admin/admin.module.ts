import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { Influencer, InfluencerSchema } from './schemas/influencer.schema.js';
import { Brand, BrandSchema } from './schemas/brand.schema.js';
import { Campaign, CampaignSchema } from './schemas/campaign.schema.js';
import { InfluencerService } from './services/influencer.service.js';
import { BrandService } from './services/brand.service.js';
import { CampaignService } from './services/campaign.service.js';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: Influencer.name, schema: InfluencerSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Campaign.name, schema: CampaignSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [InfluencerService, BrandService, CampaignService],
  exports: [InfluencerService, BrandService, CampaignService],
})
export class AdminModule {}
