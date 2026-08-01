import {
  TaskPriority,
  TaskStatus,
} from '../../../common/constants/status.enum';

import { UserResponseDto } from '../../users/dto/user-response.dto';

export class TaskResponseDto {
  id!: string;
  title!: string;
  description!: string | null;
  status!: TaskStatus;
  priority!: TaskPriority;
  dueDate!: Date | null;
  projectId!: string;
  creatorId!: string;
  assigneeId!: string | null;
  completedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
  creator?: UserResponseDto;
  assignee?: UserResponseDto;
  isCreator?: boolean;
  isAssignee?: boolean;
}
