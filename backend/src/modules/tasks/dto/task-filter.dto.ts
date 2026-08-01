/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import {
  TaskPriority,
  TaskStatus,
} from '../../../common/constants/status.enum';

import { Transform } from 'class-transformer';

export class TaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  search?: string;
}
