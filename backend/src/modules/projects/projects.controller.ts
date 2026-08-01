/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import {
  ProjectResponseDto,
  ProjectMemberResponseDto,
} from './dto/project-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { ProjectStatus } from '../../common/constants/status.enum';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // Project CRUD endpoints
  @Post()
  async create(
    @CurrentUser() currentUser: AuthUser,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(currentUser.id, createProjectDto);
  }

  @Get()
  async findAll(
    @CurrentUser() currentUser: AuthUser,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('status') status?: ProjectStatus,
    @Query('search') search?: string,
  ): Promise<PaginatedResponse<ProjectResponseDto>> {
    return this.projectsService.findAll(
      currentUser.id,
      page,
      limit,
      status,
      search,
    );
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findById(id, currentUser.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, currentUser.id, updateProjectDto);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{ message: string }> {
    await this.projectsService.delete(id, currentUser.id);
    return { message: 'Project deleted successfully' };
  }

  // ✅ NEW: Member Management Endpoints

  @Post(':id/members')
  async addMember(
    @Param('id') projectId: string,
    @CurrentUser() currentUser: AuthUser,
    @Body() addMemberDto: AddMemberDto,
  ): Promise<ProjectMemberResponseDto> {
    // Check if user is project admin or owner
    const isAuthorized = await this.projectsService.isAuthorized(
      projectId,
      currentUser.id,
    );
    if (!isAuthorized) {
      throw new ForbiddenException(
        'Only project owner or admin can add members',
      );
    }

    return this.projectsService.addMember(
      projectId,
      addMemberDto.userId,
      addMemberDto.role,
    );
  }

  @Delete(':id/members/:userId')
  async removeMember(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<{ message: string }> {
    // Check if user is project admin or owner
    const isAuthorized = await this.projectsService.isAuthorized(
      projectId,
      currentUser.id,
    );
    if (!isAuthorized) {
      throw new ForbiddenException(
        'Only project owner or admin can remove members',
      );
    }

    await this.projectsService.removeMember(projectId, userId);
    return { message: 'Member removed successfully' };
  }

  @Get(':id/members')
  async getProjectMembers(
    @Param('id') projectId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ProjectMemberResponseDto[]> {
    return this.projectsService.getProjectMembers(projectId, currentUser.id);
  }

  @Patch(':id/members/:memberId')
  async updateMemberRole(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() currentUser: AuthUser,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
  ): Promise<ProjectMemberResponseDto> {
    // Check if user is project admin or owner
    const isAuthorized = await this.projectsService.isAuthorized(
      projectId,
      currentUser.id,
    );
    if (!isAuthorized) {
      throw new ForbiddenException(
        'Only project owner or admin can update member roles',
      );
    }

    return this.projectsService.updateMemberRole(
      projectId,
      memberId,
      updateMemberRoleDto.role,
    );
  }
}
