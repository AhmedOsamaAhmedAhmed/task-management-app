import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management',
  entities: [join(__dirname, '..', '..', '**', '*.entity.{ts,js}')],
  migrations: [
    join(__dirname, '..', '..', 'database', 'migrations', '*.{ts,js}'),
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
