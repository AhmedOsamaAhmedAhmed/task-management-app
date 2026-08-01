import { ProjectRole } from '../../../common/constants/roles.enum';
import { ProjectStatus } from '../../../common/constants/status.enum';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class ProjectMemberResponseDto {
  id!: string;
  userId!: string;
  role!: ProjectRole;
  joinedAt!: Date;
  user?: UserResponseDto;
}

export class ProjectResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  status!: ProjectStatus;
  ownerId!: string;
  owner?: UserResponseDto;
  members?: ProjectMemberResponseDto[];
  createdAt!: Date;
  updatedAt!: Date;
  isOwner?: boolean;
  isMember?: boolean;
}
