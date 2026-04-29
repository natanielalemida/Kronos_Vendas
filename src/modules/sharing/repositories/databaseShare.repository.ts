import * as FileSystem from 'expo-file-system';
import {Platform} from 'react-native';

import {DatabaseSharePaths} from '../types/sharing.types';

const DATABASE_NAME = 'KronosVendas.db';

export class DatabaseShareRepository {
  resolvePaths(): DatabaseSharePaths {
    const cacheDirectory = FileSystem.cacheDirectory;
    const documentDirectory = FileSystem.documentDirectory;

    if (!cacheDirectory) {
      throw new Error('Cache directory is not available.');
    }

    if (Platform.OS === 'android') {
      return {
        sourceUri: `file:///data/data/com.kronos_vendas/databases/${DATABASE_NAME}`,
        cacheUri: `${cacheDirectory}${DATABASE_NAME}`,
      };
    }

    if (!documentDirectory) {
      throw new Error('Document directory is not available.');
    }

    return {
      sourceUri: `${documentDirectory.replace(
        /Documents\/$/,
        'Library/',
      )}LocalDatabase/${DATABASE_NAME}`,
      cacheUri: `${cacheDirectory}${DATABASE_NAME}`,
    };
  }

  async replaceCacheFile(paths: DatabaseSharePaths): Promise<string> {
    const cacheFileInfo = await FileSystem.getInfoAsync(paths.cacheUri);

    if (cacheFileInfo.exists) {
      await FileSystem.deleteAsync(paths.cacheUri, {idempotent: true});
    }

    await FileSystem.copyAsync({
      from: paths.sourceUri,
      to: paths.cacheUri,
    });

    return paths.cacheUri;
  }
}
