import * as Sharing from 'expo-sharing';

import {DatabaseShareRepository} from '../repositories/databaseShare.repository';
import {ShareFileResult} from '../types/sharing.types';

export class DatabaseShareService {
  constructor(
    private readonly databaseShareRepository: DatabaseShareRepository,
  ) {}

  async shareDatabase(): Promise<ShareFileResult> {
    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      return {
        shared: false,
      };
    }

    const paths = this.databaseShareRepository.resolvePaths();
    const cacheUri = await this.databaseShareRepository.replaceCacheFile(paths);

    await Sharing.shareAsync(cacheUri, {
      UTI: '.db',
      mimeType: 'application/x-sqlite3',
    });

    return {
      shared: true,
      fileUri: cacheUri,
    };
  }
}
