/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { ProjectStatus } from '../../../common/constants/status.enum';

@Injectable()
export class ProjectRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async findAllByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: ProjectStatus,
    search?: string,
  ): Promise<{ projects: Project[]; total: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.members', 'members')
      .leftJoinAndSelect('members.user', 'memberUser')
      .where('project.ownerId = :userId OR members.userId = :userId', {
        userId,
      })
      .andWhere('project.deletedAt IS NULL');

    if (status) {
      queryBuilder.andWhere('project.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        'project.name ILIKE :search OR project.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('project.createdAt', 'DESC').skip(skip).take(limit);

    const [projects, total] = await queryBuilder.getManyAndCount();
    return { projects, total };
  }

  async findByIdWithRelations(id: string): Promise<Project | null> {
    return this.findOne({
      where: { id, deletedAt: null } as any,
      relations: ['owner', 'members', 'members.user'],
    });
  }

  async softDeleteProject(id: string): Promise<void> {
    await this.update(id, { deletedAt: new Date() });
  }

  async isUserMember(projectId: string, userId: string): Promise<boolean> {
    const result = await this.createQueryBuilder('project')
      .innerJoin('project.members', 'members')
      .where('project.id = :projectId AND members.userId = :userId', {
        projectId,
        userId,
      })
      .getCount();

    return result > 0;
  }

  async isUserOwner(projectId: string, userId: string): Promise<boolean> {
    const result = await this.createQueryBuilder('project')
      .where('project.id = :projectId AND project.ownerId = :userId', {
        projectId,
        userId,
      })
      .getCount();

    return result > 0;
  }
}
