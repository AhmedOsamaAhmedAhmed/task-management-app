import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ForbiddenException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('projects/:projectId/tasks')
  async create(
    @Param('projectId') projectId: string,
    @CurrentUser() currentUser: AuthUser,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(projectId, currentUser.id, createTaskDto);
  }

  @Get('projects/:projectId/tasks')
  async findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() currentUser: AuthUser,
    @Query() filterDto: TaskFilterDto,
  ): Promise<PaginatedResponse<TaskResponseDto>> {
    return this.tasksService.findAll(projectId, currentUser.id, filterDto);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findById(id, currentUser.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(id, currentUser.id, updateTaskDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{ message: string }> {
    await this.tasksService.delete(id, currentUser.id);
    return { message: 'Task deleted successfully' };
  }

  @Post(':id/assign')
  async assignTask(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
    @Body() assignTaskDto: AssignTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.assignTask(id, currentUser.id, assignTaskDto);
  }
}
