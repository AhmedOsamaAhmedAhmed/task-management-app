import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management',
  entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
  autoLoadEntities: true,
  synchronize: false,
  migrations: [
    join(__dirname, '..', '..', 'database', 'migrations', '*.{ts,js}'),
  ],
  migrationsRun: false,
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
});
