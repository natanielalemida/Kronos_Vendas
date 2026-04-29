import {Knex} from 'knex';
import {knexConfig} from '@/database/connection';

import {AppliedMigrationRecord} from '../types/migration.types';

const MIGRATIONS_TABLE = 'app_migrations';

export class MigrationRepository {
  async ensureMigrationsTable(): Promise<void> {
    const hasTable = await knexConfig.schema.hasTable(MIGRATIONS_TABLE);

    if (hasTable) {
      return;
    }

    await knexConfig.schema.createTable(
      MIGRATIONS_TABLE,
      (table: Knex.TableBuilder) => {
        table.string('id').primary();
        table.string('description').notNullable();
        table.timestamp('executed_at').defaultTo(knexConfig.fn.now());
      },
    );
  }

  async getAppliedMigrations(): Promise<AppliedMigrationRecord[]> {
    await this.ensureMigrationsTable();

    return knexConfig<AppliedMigrationRecord>(MIGRATIONS_TABLE)
      .select('id')
      .orderBy('executed_at', 'asc');
  }

  async markAsExecuted(id: string, description: string): Promise<void> {
    await this.ensureMigrationsTable();

    await knexConfig(MIGRATIONS_TABLE).insert({
      id,
      description,
    });
  }
}
