import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasks1743300000000 implements MigrationInterface {
  name = 'CreateTasks1743300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tasks table
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "status" character varying(20) NOT NULL DEFAULT 'todo',
        "priority" character varying(20) NOT NULL DEFAULT 'medium',
        "due_date" TIMESTAMP,
        "project_id" uuid NOT NULL,
        "creator_id" uuid NOT NULL,
        "assignee_id" uuid,
        "completed_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tasks_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id"),
        CONSTRAINT "FK_tasks_creator" FOREIGN KEY ("creator_id") REFERENCES "users"("id"),
        CONSTRAINT "FK_tasks_assignee" FOREIGN KEY ("assignee_id") REFERENCES "users"("id")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_tasks_project" ON "tasks" ("project_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_tasks_creator" ON "tasks" ("creator_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_tasks_assignee" ON "tasks" ("assignee_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_tasks_status" ON "tasks" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_tasks_priority" ON "tasks" ("priority")
    `);

    console.log('✅ Migration CreateTasks executed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_priority"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_assignee"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_creator"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tasks_project"`);

    // Drop table
    await queryRunner.query(`DROP TABLE "tasks"`);

    console.log('✅ Migration CreateTasks reverted successfully');
  }
}
