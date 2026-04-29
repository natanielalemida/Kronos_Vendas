import {DatabaseShareRepository} from '../repositories/databaseShare.repository';
import {DatabaseShareService} from '../services/databaseShare.service';
import {ShareFileResult} from '../types/sharing.types';

export class DatabaseShareController {
  private readonly databaseShareService: DatabaseShareService;

  constructor() {
    this.databaseShareService = new DatabaseShareService(
      new DatabaseShareRepository(),
    );
  }

  async share(): Promise<ShareFileResult> {
    return this.databaseShareService.shareDatabase();
  }
}
