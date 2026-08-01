import { IsEnum } from 'class-validator';
import { UserRole } from '../../../common/constants/roles.enum';

export class ChangeRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
