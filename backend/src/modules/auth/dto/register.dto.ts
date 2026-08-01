import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from '../../../common/constants/roles.enum';

export class RegisterDto {
  @IsEmail()
  @MaxLength(255)
  email: string = '';

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must contain at least 1 letter and 1 number',
  })
  password: string = '';

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string = '';

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string = '';

  @IsOptional()
  @IsIn([UserRole.ADMIN, UserRole.MEMBER])
  role?: UserRole;
}
