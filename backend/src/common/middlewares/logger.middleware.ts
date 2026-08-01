import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';

    // Log request
    this.logger.log(`📥 ${method} ${originalUrl} - ${ip} - ${userAgent}`);

    // Log response
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const statusIcon =
        statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';

      this.logger.log(
        `${statusIcon} ${method} ${originalUrl} - ${statusCode} ${contentLength || '0'}b`,
      );
    });

    next();
  }
}
