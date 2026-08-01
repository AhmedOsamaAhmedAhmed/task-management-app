/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants/roles.enum';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
    @Query('isActive') isActive?: string,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    // Convert isActive string to boolean
    let isActiveBoolean: boolean | undefined;
    if (isActive === 'true') isActiveBoolean = true;
    if (isActive === 'false') isActiveBoolean = false;

    return this.usersService.findAll(
      page,
      limit,
      search,
      role,
      isActiveBoolean,
    );
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<UserResponseDto> {
    // Allow users to view their own profile or admins to view any
    if (currentUser.id !== id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<UserResponseDto> {
    // Allow users to update their own profile or admins to update any
    if (currentUser.id !== id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  async changeRole(
    @Param('id') id: string,
    @Body() changeRoleDto: ChangeRoleDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<UserResponseDto> {
    // Prevent admin from changing their own role
    if (currentUser.id === id) {
      throw new ForbiddenException('You cannot change your own role');
    }

    return this.usersService.changeRole(id, changeRoleDto.role);
  }

  @Patch(':id/toggle-status')
  @Roles(UserRole.ADMIN)
  async toggleStatus(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<UserResponseDto> {
    // Prevent admin from deactivating themselves
    if (currentUser.id === id) {
      throw new ForbiddenException('You cannot change your own status');
    }

    return this.usersService.toggleUserStatus(id);
  }
}
