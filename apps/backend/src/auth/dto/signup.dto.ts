import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

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
}
