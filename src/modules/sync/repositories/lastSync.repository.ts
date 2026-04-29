import {SyncMetadataRepository} from './sync-metadata.repository';

export class LastSyncRepository {
  private readonly syncMetadataRepository = new SyncMetadataRepository();

  async getLastSync(): Promise<string | undefined> {
    return this.syncMetadataRepository.getLastSuccessfulSyncAt();
  }
}
