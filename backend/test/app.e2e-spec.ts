/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as request from 'supertest';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { UserRole } from '../../src/common/constants/roles.enum';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  let userId: string;

  const adminUser = {
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
  };

  const testUser = {
    email: 'user@example.com',
    password: 'user123',
    firstName: 'Test',
    lastName: 'User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    dataSource = app.get(DataSource);

    // Create admin user
    const adminResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(adminUser);

    adminToken = adminResponse.body.data.accessToken;
    adminId = adminResponse.body.data.user.id;

    // Create regular user
    const userResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser);

    userToken = userResponse.body.data.accessToken;
    userId = userResponse.body.data.user.id;
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
    await app.close();
  });

  describe('GET /api/users', () => {
    it('should allow admin to get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body.data.data.length).toBeGreaterThan(0);

      // Check that password_hash is not returned
      const user = response.body.data.data[0];
      expect(user).not.toHaveProperty('password_hash');
    });

    it('should allow admin to filter users by role', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users?role=admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const admins = response.body.data.data;
      admins.forEach((user: any) => {
        expect(user.role).toBe(UserRole.ADMIN);
      });
    });

    it('should allow admin to search users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users?search=Admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.data.length).toBeGreaterThan(0);
      const user = response.body.data.data[0];
      expect(user.firstName).toContain('Admin');
    });

    it('should reject non-admin users', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should reject unauthorized requests', async () => {
      await request(app.getHttpServer()).get('/api/users').expect(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should allow admin to get any user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userId);
      expect(response.body.data).not.toHaveProperty('password_hash');
    });

    it('should allow users to get their own profile', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.data.id).toBe(userId);
    });

    it('should not allow users to get other users', async () => {
      await request(app.getHttpServer())
        .get(`/api/users/${adminId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should allow users to update their own profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.firstName).toBe('Updated');
      expect(response.body.data.lastName).toBe('Name');
    });

    it('should allow admin to update any user', async () => {
      const updateData = {
        firstName: 'AdminUpdated',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.firstName).toBe('AdminUpdated');
    });

    it('should not allow users to update other users', async () => {
      const updateData = {
        firstName: 'Hack',
      };

      await request(app.getHttpServer())
        .patch(`/api/users/${adminId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);
    });
  });

  describe('PATCH /api/users/:id/role', () => {
    it('should allow admin to change user role', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/users/${userId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: UserRole.ADMIN })
        .expect(200);

      expect(response.body.data.role).toBe(UserRole.ADMIN);
    });

    it('should not allow admin to change their own role', async () => {
      await request(app.getHttpServer())
        .patch(`/api/users/${adminId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: UserRole.MEMBER })
        .expect(403);
    });

    it('should not allow non-admin users to change roles', async () => {
      await request(app.getHttpServer())
        .patch(`/api/users/${userId}/role`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ role: UserRole.ADMIN })
        .expect(403);
    });
  });

  describe('PATCH /api/users/:id/toggle-status', () => {
    it('should allow admin to toggle user status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/users/${userId}/toggle-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.isActive).toBe(false);
    });

    it('should not allow admin to toggle their own status', async () => {
      await request(app.getHttpServer())
        .patch(`/api/users/${adminId}/toggle-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should not allow non-admin users to toggle status', async () => {
      await request(app.getHttpServer())
        .patch(`/api/users/${userId}/toggle-status`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
