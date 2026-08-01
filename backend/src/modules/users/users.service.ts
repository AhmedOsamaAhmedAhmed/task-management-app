/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from '../../common/constants/roles.enum';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: UserRole,
    isActive?: boolean,
  ): Promise<PaginatedResponse<UserResponseDto>> {
    const { users, total } = await this.userRepository.findAllWithPagination(
      page,
      limit,
      search,
      role,
      isActive,
    );

    const data = users.map((user) => UserResponseDto.fromUser(user));

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

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return UserResponseDto.fromUser(user);
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being changed and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update fields
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;

    await this.userRepository.save(user);

    return UserResponseDto.fromUser(user);
  }

  async changeRole(id: string, role: UserRole): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent changing own role
    // This should be checked in the controller

    user.role = role;
    await this.userRepository.save(user);

    return UserResponseDto.fromUser(user);
  }

  async toggleUserStatus(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent deactivating own account
    // This should be checked in the controller

    user.isActive = !user.isActive;
    await this.userRepository.save(user);

    return UserResponseDto.fromUser(user);
  }

  async deactivateUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = false;
    await this.userRepository.save(user);

    return UserResponseDto.fromUser(user);
  }

  async activateUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = true;
    await this.userRepository.save(user);

    return UserResponseDto.fromUser(user);
  }
}
