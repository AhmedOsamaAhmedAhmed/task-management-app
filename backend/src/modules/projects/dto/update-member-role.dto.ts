import { IsEnum } from 'class-validator';
import { ProjectRole } from '../../../common/constants/roles.enum';

export class UpdateMemberRoleDto {
  @IsEnum(ProjectRole)
  role!: ProjectRole;
}
