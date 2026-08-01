/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { BadRequestException } from '@nestjs/common';
import { ParseUUIDPipe } from '../../../../src/common/pipes/parse-uuid.pipe';

describe('ParseUUIDPipe', () => {
  let pipe: ParseUUIDPipe;

  beforeEach(() => {
    pipe = new ParseUUIDPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should validate and return a valid UUID', async () => {
    const validUUID = '123e4567-e89b-12d3-a456-426614174000';
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const result = await pipe.transform(validUUID, {
      data: 'id',
      type: 'param',
    });
    expect(result).toBe(validUUID);
  });

  it('should throw BadRequestException for invalid UUID', async () => {
    const invalidUUID = 'invalid-uuid';
    await expect(
      pipe.transform(invalidUUID, { data: 'id', type: 'param' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for empty value', async () => {
    await expect(
      pipe.transform('', { data: 'id', type: 'param' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for null value', async () => {
    await expect(
      pipe.transform(null as any, { data: 'id', type: 'param' }),
    ).rejects.toThrow(BadRequestException);
  });
});
