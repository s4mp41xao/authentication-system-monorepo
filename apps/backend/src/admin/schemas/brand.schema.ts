import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  description?: string;

  @Prop()
  website?: string;

  @Prop()
  industry?: string;

  @Prop({ default: true })
  active: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
