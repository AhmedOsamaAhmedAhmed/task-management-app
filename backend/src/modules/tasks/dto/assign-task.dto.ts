import { IsOptional, IsUUID } from 'class-validator';

export class AssignTaskDto {
  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;
}
