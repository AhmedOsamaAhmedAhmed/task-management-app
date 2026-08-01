import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1743300000000 implements MigrationInterface {
  name = 'CreateUsers1743300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "first_name" character varying(100) NOT NULL,
        "last_name" character varying(100) NOT NULL,
        "role" character varying(20) NOT NULL DEFAULT 'member',
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_role" ON "users" ("role")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_is_active" ON "users" ("is_active")
    `);

    console.log('✅ Migration CreateUsers executed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_role"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);

    // Drop table
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop extension
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);

    console.log('✅ Migration CreateUsers reverted successfully');
  }
}
