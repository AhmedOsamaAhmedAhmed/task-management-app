/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ProjectMemberResponseDto,
  ProjectResponseDto,
} from './dto/project-response.dto';

import { AddMemberDto } from './dto/add-member.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectMemberRepository } from './repositories/project-member.repository';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectRole } from '../../common/constants/roles.enum';
import { ProjectStatus } from '../../common/constants/status.enum';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private projectRepository: ProjectRepository,
    private projectMemberRepository: ProjectMemberRepository,
  ) {}

  // ... (previous methods: create, findAll, findById, update, delete)

  async create(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const { name, description } = createProjectDto;

    const project = this.projectRepository.create({
      name,
      description,
      ownerId: userId,
      status: ProjectStatus.ACTIVE,
    });

    await this.projectRepository.save(project);

    // Add owner as member with admin role
    await this.projectMemberRepository.addMember(
      project.id,
      userId,
      ProjectRole.ADMIN,
    );

    return this.mapToResponse(project, userId);
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: ProjectStatus,
    search?: string,
  ): Promise<PaginatedResponse<ProjectResponseDto>> {
    const { projects, total } = await this.projectRepository.findAllByUser(
      userId,
      page,
      limit,
      status,
      search,
    );

    const data = projects.map((project) => this.mapToResponse(project, userId));

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

  async findById(id: string, userId: string): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findByIdWithRelations(id);

    if (!project || project.deletedAt) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Check if user has access to this project
    const hasAccess = await this.hasAccess(id, userId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return this.mapToResponse(project, userId);
  }

  async update(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectRepository.findByIdWithRelations(id);

    if (!project || project.deletedAt) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Check if user is owner or admin
    const isAuthorized = await this.isAuthorized(id, userId);
    if (!isAuthorized) {
      throw new ForbiddenException(
        'Only project owner or admin can update this project',
      );
    }

    // Update fields
    if (updateProjectDto.name) project.name = updateProjectDto.name;
    if (updateProjectDto.description !== undefined) {
      project.description = updateProjectDto.description;
    }
    if (updateProjectDto.status) project.status = updateProjectDto.status;

    await this.projectRepository.save(project);

    return this.mapToResponse(project, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findByIdWithRelations(id);

    if (!project || project.deletedAt) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Only owner can delete
    if (project.ownerId !== userId) {
      throw new ForbiddenException(
        'Only project owner can delete this project',
      );
    }

    await this.projectRepository.softDeleteProject(id);
  }

  // ✅ NEW: Member Management Methods

  async addMember(
    projectId: string,
    userId: string,
    role: ProjectRole = ProjectRole.MEMBER,
  ): Promise<ProjectMemberResponseDto> {
    // Check if project exists
    const project =
      await this.projectRepository.findByIdWithRelations(projectId);
    if (!project || project.deletedAt) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user exists
    // This should be validated by the repository

    // Check if user is already a member
    const existingMember = await this.projectMemberRepository.findMember(
      projectId,
      userId,
    );
    if (existingMember) {
      throw new ConflictException('User is already a member of this project');
    }

    // Check if user is the owner (owner is automatically a member)
    if (project.ownerId === userId) {
      throw new BadRequestException('Project owner is already a member');
    }

    // Add member
    const member = await this.projectMemberRepository.addMember(
      projectId,
      userId,
      role,
    );

    return this.mapMemberToResponse(member);
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    // Check if project exists
    const project =
      await this.projectRepository.findByIdWithRelations(projectId);
    if (!project || project.deletedAt) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Cannot remove the owner
    if (project.ownerId === userId) {
      throw new BadRequestException('Cannot remove the project owner');
    }

    // Check if user is a member
    const member = await this.projectMemberRepository.findMember(
      projectId,
      userId,
    );
    if (!member) {
      throw new NotFoundException('User is not a member of this project');
    }

    // Remove member
    await this.projectMemberRepository.removeMember(projectId, userId);
  }

  async getProjectMembers(
    projectId: string,
    userId: string,
  ): Promise<ProjectMemberResponseDto[]> {
    // Check if project exists
    const project =
      await this.projectRepository.findByIdWithRelations(projectId);
    if (!project || project.deletedAt) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if user has access to this project
    const hasAccess = await this.hasAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project');
    }

    // Get members
    const members = await this.projectMemberRepository.findMembers(projectId);
    return members.map((member) => this.mapMemberToResponse(member));
  }

  async updateMemberRole(
    projectId: string,
    memberId: string,
    role: ProjectRole,
  ): Promise<ProjectMemberResponseDto> {
    // Check if project exists
    const project =
      await this.projectRepository.findByIdWithRelations(projectId);
    if (!project || project.deletedAt) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Check if member exists
    const member = await this.projectMemberRepository.findOne({
      where: { id: memberId, projectId },
      relations: ['user'],
    });
    if (!member) {
      throw new NotFoundException('Member not found in this project');
    }

    // Cannot change the owner's role
    if (project.ownerId === member.userId) {
      throw new BadRequestException("Cannot change the project owner's role");
    }

    // Update role
    await this.projectMemberRepository.updateMemberRole(
      projectId,
      member.userId,
      role,
    );

    // Get updated member
    const updatedMember = await this.projectMemberRepository.findMember(
      projectId,
      member.userId,
    );
    if (!updatedMember) {
      throw new NotFoundException('Member not found after update');
    }

    return this.mapMemberToResponse(updatedMember);
  }

  // Helper methods

  async hasAccess(projectId: string, userId: string): Promise<boolean> {
    const isOwner = await this.projectRepository.isUserOwner(projectId, userId);
    if (isOwner) return true;

    const isMember = await this.projectRepository.isUserMember(
      projectId,
      userId,
    );
    return isMember;
  }

  async isAuthorized(projectId: string, userId: string): Promise<boolean> {
    const isOwner = await this.projectRepository.isUserOwner(projectId, userId);
    if (isOwner) return true;

    const isAdmin = await this.projectMemberRepository.isProjectAdmin(
      projectId,
      userId,
    );
    return isAdmin;
  }

  async isProjectAdmin(projectId: string, userId: string): Promise<boolean> {
    return this.projectMemberRepository.isProjectAdmin(projectId, userId);
  }

  private mapToResponse(project: Project, userId: string): ProjectResponseDto {
    const response = new ProjectResponseDto();
    response.id = project.id;
    response.name = project.name;
    response.description = project.description;
    response.status = project.status;
    response.ownerId = project.ownerId;
    response.createdAt = project.createdAt;
    response.updatedAt = project.updatedAt;

    if (project.owner) {
      response.owner = UserResponseDto.fromUser(project.owner);
    }

    if (project.members && Array.isArray(project.members)) {
      response.members = project.members.map((member: ProjectMember) => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
        user: member.user ? UserResponseDto.fromUser(member.user) : undefined,
      }));
    }

    response.isOwner = project.ownerId === userId;

    if (project.members && Array.isArray(project.members)) {
      response.isMember = project.members.some(
        (member: ProjectMember) => member.userId === userId,
      );
    } else {
      response.isMember = false;
    }

    return response;
  }

  private mapMemberToResponse(member: ProjectMember): ProjectMemberResponseDto {
    const response = new ProjectMemberResponseDto();
    response.id = member.id;
    response.userId = member.userId;
    response.role = member.role;
    response.joinedAt = member.joinedAt;
    if (member.user) {
      response.user = UserResponseDto.fromUser(member.user);
    }
    return response;
  }
}
