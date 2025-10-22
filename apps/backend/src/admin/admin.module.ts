import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { Influencer, InfluencerSchema } from './schemas/influencer.schema';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { InfluencerService } from './services/influencer.service';
import { BrandService } from './services/brand.service';
import { CampaignService } from './services/campaign.service';

@Module({
  imports: [
    AuthModule,
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
