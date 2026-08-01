import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { ProjectMember } from '../entities/project-member.entity';
import { ProjectRole } from '../../../common/constants/roles.enum';

@Injectable()
export class ProjectMemberRepository extends Repository<ProjectMember> {
  constructor(private dataSource: DataSource) {
    super(ProjectMember, dataSource.createEntityManager());
  }

  async addMember(
    projectId: string,
    userId: string,
    role: ProjectRole = ProjectRole.MEMBER,
  ): Promise<ProjectMember> {
    const member = this.create({
      projectId,
      userId,
      role,
    });
    return this.save(member);
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await this.delete({ projectId, userId });
  }

  async findMember(
    projectId: string,
    userId: string,
  ): Promise<ProjectMember | null> {
    return this.findOne({
      where: { projectId, userId },
      relations: ['user'],
    });
  }

  async findMembers(projectId: string): Promise<ProjectMember[]> {
    return this.find({
      where: { projectId },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }

  async isProjectAdmin(projectId: string, userId: string): Promise<boolean> {
    const member = await this.findOne({
      where: { projectId, userId, role: ProjectRole.ADMIN },
    });
    return !!member;
  }

  async updateMemberRole(
    projectId: string,
    userId: string,
    role: ProjectRole,
  ): Promise<void> {
    await this.update({ projectId, userId }, { role });
  }
}
