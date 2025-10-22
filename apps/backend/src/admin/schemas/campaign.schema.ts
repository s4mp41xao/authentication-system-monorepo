import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignDocument = Campaign & Document;

export enum CampaignStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brandId: string;

  @Prop()
  description?: string;

  @Prop({ type: String, enum: CampaignStatus, default: CampaignStatus.ACTIVE })
  status: CampaignStatus;

  @Prop()
  budget?: number;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ type: [String], default: [] })
  assignedInfluencers: string[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
