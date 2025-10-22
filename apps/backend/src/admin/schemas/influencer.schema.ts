import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InfluencerDocument = Influencer & Document;

@Schema({ timestamps: true })
export class Influencer {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  bio?: string;

  @Prop()
  instagram?: string;

  @Prop()
  tiktok?: string;

  @Prop()
  youtube?: string;

  @Prop({ default: 0 })
  followers: number;

  @Prop({ default: true })
  active: boolean;
}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);
