import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskPriority, TaskStatus } from '../../common/constants/status.enum';

import { AssignTaskDto } from './dto/assign-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { ProjectsService } from '../projects/projects.service';
import { Task } from './entities/task.entity';
import { TaskFilterDto } from './dto/task-filter.dto';
import { TaskRepository } from './repositories/task.repository';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class TasksService {
  constructor(
    private taskRepository: TaskRepository,
    private projectsService: ProjectsService,
  ) {}

  async create(
    projectId: string,
    userId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    // Check if user has access to the project
    const hasAccess = await this.projectsService.hasAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const { title, description, status, priority, dueDate, assigneeId } =
      createTaskDto;

    // If assignee is specified, check if they are a member of the project
    if (assigneeId) {
      const isMember = await this.projectsService.hasAccess(
        projectId,
        assigneeId,
      );
      if (!isMember) {
        throw new BadRequestException(
          'Assignee must be a member of the project',
        );
      }
    }

    const task = this.taskRepository.create({
      title,
      description: description || null,
      status: status || TaskStatus.TODO,
      priority: priority || TaskPriority.MEDIUM,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
      creatorId: userId,
      assigneeId: assigneeId || null,
      completedAt: status === TaskStatus.DONE ? new Date() : null,
    });

    await this.taskRepository.save(task);
    return this.mapToResponse(task);
  }

  async findAll(
    projectId: string,
    userId: string,
    filterDto: TaskFilterDto,
  ): Promise<PaginatedResponse<TaskResponseDto>> {
    // Check if user has access to the project
    const hasAccess = await this.projectsService.hasAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const {
      status,
      priority,
      assigneeId,
      page = 1,
      limit = 10,
      search,
    } = filterDto;

    const { tasks, total } = await this.taskRepository.findByProjectId(
      projectId,
      page,
      limit,
      status,
      priority,
      assigneeId,
      search,
    );

    const data = tasks.map((task) => this.mapToResponse(task, userId));

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findById(id: string, userId: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findByIdWithRelations(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user has access to the project
    const hasAccess = await this.projectsService.hasAccess(
      task.projectId,
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return this.mapToResponse(task, userId);
  }

  async update(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findByIdWithRelations(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user has access to the project
    const hasAccess = await this.projectsService.hasAccess(
      task.projectId,
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this task');
    }

    // Check if user is authorized to update
    const isAuthorized = await this.isAuthorized(task, userId);
    if (!isAuthorized) {
      throw new ForbiddenException(
        'Only project admin or task creator can update this task',
      );
    }

    // If assignee is being updated, check if they are a member of the project
    if (updateTaskDto.assigneeId !== undefined) {
      if (updateTaskDto.assigneeId) {
        const isMember = await this.projectsService.hasAccess(
          task.projectId,
          updateTaskDto.assigneeId,
        );
        if (!isMember) {
          throw new BadRequestException(
            'Assignee must be a member of the project',
          );
        }
      }
    }

    // Update fields
    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description || null;
    }
    if (updateTaskDto.status) {
      task.status = updateTaskDto.status;
      task.completedAt =
        updateTaskDto.status === TaskStatus.DONE ? new Date() : null;
    }
    if (updateTaskDto.priority) task.priority = updateTaskDto.priority;
    if (updateTaskDto.dueDate !== undefined) {
      task.dueDate = updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : null;
    }
    if (updateTaskDto.assigneeId !== undefined) {
      task.assigneeId = updateTaskDto.assigneeId || null;
    }

    await this.taskRepository.save(task);
    return this.mapToResponse(task, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findByIdWithRelations(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user has access to the project
    const hasAccess = await this.projectsService.hasAccess(
      task.projectId,
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this task');
    }

    // Check if user is authorized to delete
    const isAuthorized = await this.isAuthorized(task, userId);
    if (!isAuthorized) {
      throw new ForbiddenException(
        'Only project admin or task creator can delete this task',
      );
    }

    await this.taskRepository.delete(id);
  }

  async assignTask(
    id: string,
    userId: string,
    assignTaskDto: AssignTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findByIdWithRelations(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user has access to the project
    const hasAccess = await this.projectsService.hasAccess(
      task.projectId,
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this task');
    }

    // Check if user is authorized to assign
    const isAuthorized = await this.isAuthorized(task, userId);
    if (!isAuthorized) {
      throw new ForbiddenException(
        'Only project admin or task creator can assign this task',
      );
    }

    // If assignee is specified, check if they are a member of the project
    if (assignTaskDto.assigneeId) {
      const isMember = await this.projectsService.hasAccess(
        task.projectId,
        assignTaskDto.assigneeId,
      );
      if (!isMember) {
        throw new BadRequestException(
          'Assignee must be a member of the project',
        );
      }
    }

    task.assigneeId = assignTaskDto.assigneeId || null;
    await this.taskRepository.save(task);

    return this.mapToResponse(task, userId);
  }

  async isAuthorized(task: Task, userId: string): Promise<boolean> {
    // Task creator can update/delete
    if (task.creatorId === userId) return true;

    // Project admin can update/delete
    const isProjectAdmin = await this.projectsService.isProjectAdmin(
      task.projectId,
      userId,
    );
    return isProjectAdmin;
  }

  private mapToResponse(task: Task, userId?: string): TaskResponseDto {
    const response = new TaskResponseDto();
    response.id = task.id;
    response.title = task.title;
    response.description = task.description;
    response.status = task.status;
    response.priority = task.priority;
    response.dueDate = task.dueDate;
    response.projectId = task.projectId;
    response.creatorId = task.creatorId;
    response.assigneeId = task.assigneeId;
    response.completedAt = task.completedAt;
    response.createdAt = task.createdAt;
    response.updatedAt = task.updatedAt;

    if (task.creator) {
      response.creator = UserResponseDto.fromUser(task.creator);
    }

    if (task.assignee) {
      response.assignee = UserResponseDto.fromUser(task.assignee);
    }

    if (userId) {
      response.isCreator = task.creatorId === userId;
      response.isAssignee = task.assigneeId === userId;
    }

    return response;
  }
}
