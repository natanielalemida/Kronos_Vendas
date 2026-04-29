import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SUCCESSFUL_SYNC_AT_KEY = 'lastSuccessfulSyncAt';

export class SyncMetadataRepository {
  async getLastSuccessfulSyncAt(): Promise<string | undefined> {
    const value = await AsyncStorage.getItem(LAST_SUCCESSFUL_SYNC_AT_KEY);

    return value ?? undefined;
  }

  async saveLastSuccessfulSyncAt(value: string): Promise<void> {
    await AsyncStorage.setItem(LAST_SUCCESSFUL_SYNC_AT_KEY, value);
  }
}
