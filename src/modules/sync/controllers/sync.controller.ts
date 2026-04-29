import {UserDto} from '@/shared/types';

import {LastSyncRepository} from '../repositories/lastSync.repository';
import {LastSyncService} from '../services/lastSync.service';
import {SyncWorkflowService} from '../services/sync-workflow.service';

export class SyncController {
  private readonly lastSyncService = new LastSyncService(
    new LastSyncRepository(),
  );

  private readonly syncWorkflowService = new SyncWorkflowService();

  constructor(
    private readonly user: UserDto,
    private readonly organizationCode: number,
  ) {}

  async syncAll(): Promise<void> {
    await this.syncWorkflowService.run(
      'sync-all',
      this.user,
      this.organizationCode,
    );
  }

  async resetAndSync(): Promise<void> {
    await this.syncWorkflowService.run(
      'reset-and-sync',
      this.user,
      this.organizationCode,
    );
  }

  async syncImages(): Promise<void> {
    await this.syncWorkflowService.run(
      'sync-images',
      this.user,
      this.organizationCode,
    );
  }

  async getLastSyncLabel(): Promise<string | undefined> {
    return this.lastSyncService.getFormattedLastSync();
  }
}
