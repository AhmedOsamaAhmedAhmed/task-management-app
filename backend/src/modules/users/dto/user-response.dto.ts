/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { UserRole } from '../../../common/constants/roles.enum';

export class UserResponseDto {
  id: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  fullName: string = '';
  role: UserRole = UserRole.MEMBER;
  isActive: boolean = true;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  static fromUser(user: any): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.fullName = user.fullName || `${user.firstName} ${user.lastName}`;
    dto.role = user.role;
    dto.isActive = user.isActive;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
