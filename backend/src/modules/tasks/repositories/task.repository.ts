/* eslint-disable @typescript-eslint/no-unused-vars */

import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import {
  TaskPriority,
  TaskStatus,
} from '../../../common/constants/status.enum';

import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findByProjectId(
    projectId: string,
    page: number = 1,
    limit: number = 10,
    status?: TaskStatus,
    priority?: TaskPriority,
    assigneeId?: string,
    search?: string,
  ): Promise<{ tasks: Task[]; total: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.creator', 'creator')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .where('task.projectId = :projectId', { projectId });

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    if (assigneeId) {
      queryBuilder.andWhere('task.assigneeId = :assigneeId', { assigneeId });
    }

    if (search) {
      queryBuilder.andWhere(
        'task.title ILIKE :search OR task.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('task.createdAt', 'DESC').skip(skip).take(limit);

    const [tasks, total] = await queryBuilder.getManyAndCount();
    return { tasks, total };
  }

  async findByIdWithRelations(id: string): Promise<Task | null> {
    return this.findOne({
      where: { id },
      relations: ['project', 'creator', 'assignee'],
    });
  }

  async findByAssigneeId(userId: string): Promise<Task[]> {
    return this.find({
      where: { assigneeId: userId },
      relations: ['project', 'creator', 'assignee'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: TaskStatus): Promise<void> {
    const completedAt = status === TaskStatus.DONE ? new Date() : null;
    await this.update(id, { status, completedAt });
  }
}
