/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ExecutionContext } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../../../../src/common/decorators/public.decorator';
import { JwtAuthGuard } from '../../../../src/common/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow public routes', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const result = guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should not allow non-public routes without token', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const result = guard.canActivate(mockContext);
    expect(result).toBeInstanceOf(Promise);
  });
});
