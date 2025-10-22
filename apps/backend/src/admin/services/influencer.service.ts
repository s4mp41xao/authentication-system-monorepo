import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Influencer, InfluencerDocument } from '../schemas/influencer.schema';

@Injectable()
export class InfluencerService {
  constructor(
    @InjectModel(Influencer.name)
    private influencerModel: Model<InfluencerDocument>,
  ) {}

  async findAll(): Promise<Influencer[]> {
    return this.influencerModel.find().exec();
  }

  async count(): Promise<number> {
    return this.influencerModel.countDocuments().exec();
  }

  async findByUserId(userId: string): Promise<Influencer | null> {
    return this.influencerModel.findOne({ userId }).exec();
  }

  async create(influencerData: Partial<Influencer>): Promise<Influencer> {
    const influencer = new this.influencerModel(influencerData);
    return influencer.save();
  }

  async update(
    id: string,
    influencerData: Partial<Influencer>,
  ): Promise<Influencer | null> {
    return this.influencerModel
      .findByIdAndUpdate(id, influencerData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Influencer | null> {
    return this.influencerModel.findByIdAndDelete(id).exec();
  }
}
