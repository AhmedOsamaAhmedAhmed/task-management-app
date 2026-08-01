/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRole } from '../../../common/constants/roles.enum';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.find({ where: { isActive: true } });
  }

  async findById(id: string): Promise<User | null> {
    return this.findOne({ where: { id } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.count({ where: { email } });
    return count > 0;
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: UserRole,
    isActive?: boolean,
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User> = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      // This will be handled by the query builder
      const queryBuilder = this.createQueryBuilder('user');

      if (search) {
        queryBuilder.where(
          'user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
          { search: `%${search}%` },
        );
      }

      if (role) {
        queryBuilder.andWhere('user.role = :role', { role });
      }

      if (isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive });
      }

      queryBuilder.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);

      const [users, total] = await queryBuilder.getManyAndCount();
      return { users, total };
    }

    const [users, total] = await this.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { users, total };
  }
}
