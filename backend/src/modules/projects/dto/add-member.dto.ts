import { IsEnum, IsUUID } from 'class-validator';

import { ProjectRole } from '../../../common/constants/roles.enum';

export class AddMemberDto {
  @IsUUID()
  userId!: string;

  @IsEnum(ProjectRole)
  role: ProjectRole = ProjectRole.MEMBER;
}
