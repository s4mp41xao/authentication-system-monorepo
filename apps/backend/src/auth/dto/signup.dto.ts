import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum.js';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole, {
    message: 'Role must be one of: influencer, brand, or ori',
  })
  role: UserRole;

  // Campos opcionais para Influencer
  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsNumber()
  followers?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  // Campos opcionais para Brand
  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
