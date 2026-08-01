/* eslint-disable @typescript-eslint/no-unused-vars */

import { ExecutionContext, ForbiddenException } from '@nestjs/common';

import { ROLES_KEY } from '../../../../src/common/decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../../../src/common/guards/roles.guard';
import { UserRole } from '../../../../src/common/constants/roles.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: UserRole.ADMIN },
        }),
      }),
    } as any;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should allow access when user has required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);
    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when user does not have required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mockContextWithoutAdmin = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: UserRole.MEMBER },
        }),
      }),
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => guard.canActivate(mockContextWithoutAdmin)).toThrow(
      ForbiddenException,
    );
  });

  it('should throw ForbiddenException when user is not authenticated', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.ADMIN]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mockContextWithoutUser = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => guard.canActivate(mockContextWithoutUser)).toThrow(
      ForbiddenException,
    );
  });
});
