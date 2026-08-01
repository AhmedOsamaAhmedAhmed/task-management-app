/* eslint-disable prettier/prettier */

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { validate as isUUID } from 'uuid';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      throw new BadRequestException(`${metadata.data} is required`);
    }

    if (!isUUID(value)) {
      throw new BadRequestException(
        `${metadata.data} must be a valid UUID. Got: ${value}`,
      );
    }

    return value;
  }
}