import { IsString, IsOptional, IsNumber, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CampaignStatus } from '../schemas/campaign.schema';

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  brandId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
