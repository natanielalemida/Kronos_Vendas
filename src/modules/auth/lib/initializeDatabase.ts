import {DatabaseController} from '@/modules/database/controllers/database.controller';

const databaseController = new DatabaseController();

export async function initializeDatabase(): Promise<void> {
  await databaseController.initialize();
}
