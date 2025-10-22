import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Campaign,
  CampaignDocument,
  CampaignStatus,
} from '../schemas/campaign.schema';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
  ) {}

  async findAll(): Promise<Campaign[]> {
    return this.campaignModel.find().exec();
  }

  async findActive(): Promise<Campaign[]> {
    return this.campaignModel.find({ status: CampaignStatus.ACTIVE }).exec();
  }

  async countActive(): Promise<number> {
    return this.campaignModel
      .countDocuments({ status: CampaignStatus.ACTIVE })
      .exec();
  }

  async count(): Promise<number> {
    return this.campaignModel.countDocuments().exec();
  }

  async findById(id: string): Promise<Campaign | null> {
    return this.campaignModel.findById(id).exec();
  }

  async create(campaignData: Partial<Campaign>): Promise<Campaign> {
    const campaign = new this.campaignModel(campaignData);
    return campaign.save();
  }

  async update(
    id: string,
    campaignData: Partial<Campaign>,
  ): Promise<Campaign | null> {
    return this.campaignModel
      .findByIdAndUpdate(id, campaignData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Campaign | null> {
    return this.campaignModel.findByIdAndDelete(id).exec();
  }

  async assignInfluencer(
    campaignId: string,
    influencerId: string,
  ): Promise<Campaign | null> {
    return this.campaignModel
      .findByIdAndUpdate(
        campaignId,
        { $addToSet: { assignedInfluencers: influencerId } },
        { new: true },
      )
      .exec();
  }

  async removeInfluencer(
    campaignId: string,
    influencerId: string,
  ): Promise<Campaign | null> {
    return this.campaignModel
      .findByIdAndUpdate(
        campaignId,
        { $pull: { assignedInfluencers: influencerId } },
        { new: true },
      )
      .exec();
  }
}
