import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjects1743300000000 implements MigrationInterface {
  name = 'CreateProjects1743300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "description" text,
        "status" character varying(20) NOT NULL DEFAULT 'active',
        "owner_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_projects_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("id")
      )
    `);

    // Create project_members table
    await queryRunner.query(`
      CREATE TABLE "project_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "role" character varying(20) NOT NULL DEFAULT 'member',
        "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_project_members_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_project_members_project_user" UNIQUE ("project_id", "user_id"),
        CONSTRAINT "FK_project_members_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id"),
        CONSTRAINT "FK_project_members_user" FOREIGN KEY ("user_id") REFERENCES "users"("id")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_projects_owner" ON "projects" ("owner_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_projects_status" ON "projects" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_project_members_project" ON "project_members" ("project_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_project_members_user" ON "project_members" ("user_id")
    `);

    console.log('✅ Migration CreateProjects executed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_project_members_user"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_project_members_project"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_projects_owner"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "project_members"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects"`);

    console.log('✅ Migration CreateProjects reverted successfully');
  }
}
