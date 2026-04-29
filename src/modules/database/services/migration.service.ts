import {MigrationRepository} from '../repositories/migration.repository';
import {DatabaseMigrationDefinition} from '../types/migration.types';

export class MigrationService {
  constructor(
    private readonly migrationRepository: MigrationRepository,
    private readonly migrations: DatabaseMigrationDefinition[],
  ) {}

  async runPendingMigrations(): Promise<void> {
    const appliedMigrations =
      await this.migrationRepository.getAppliedMigrations();
    const appliedMigrationIds = new Set(appliedMigrations.map(item => item.id));

    for (const migration of this.migrations) {
      if (appliedMigrationIds.has(migration.id)) {
        continue;
      }

      await migration.run();
      await this.migrationRepository.markAsExecuted(
        migration.id,
        migration.description,
      );
    }
  }
}
