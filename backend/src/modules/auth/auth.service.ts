/* eslint-disable @typescript-eslint/no-unused-vars */

import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UserRole } from '../../common/constants/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user
    const user = new User();
    user.email = email;
    user.password_hash = password; // Will be hashed by @BeforeInsert
    user.firstName = firstName;
    user.lastName = lastName;
    // ✅ إصلاح: استخدام القيمة الافتراضية من enum
    user.role = role || UserRole.MEMBER;
    user.isActive = true;

    await this.userRepository.save(user);

    // Generate JWT token
    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return null;
    }

    if (!user.isActive) {
      return null;
    }

    const { password_hash, ...result } = user;
    return result;
  }

  private generateAuthResponse(user: User): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const userResponse = new UserResponseDto();
    userResponse.id = user.id;
    userResponse.email = user.email;
    userResponse.firstName = user.firstName;
    userResponse.lastName = user.lastName;
    userResponse.fullName = user.fullName;
    userResponse.role = user.role;
    userResponse.isActive = user.isActive;
    userResponse.createdAt = user.createdAt;
    userResponse.updatedAt = user.updatedAt;

    return {
      accessToken,
      user: userResponse,
    };
  }
}
