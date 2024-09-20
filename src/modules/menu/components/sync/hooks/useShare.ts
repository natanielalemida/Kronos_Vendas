import {useCallback} from 'react';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const useShareDatabase = () => {
  const shareDatabaseFile = useCallback(async () => {
    const originalPath =
      '/data/data/com.kronos_vendas/databases/KronosVendas.db';

    const cachePath = `${RNFS.CachesDirectoryPath}/KronosVendas.db`;

    await RNFS.copyFile(originalPath, cachePath);

    const shareOptions = {
      title: 'Compartilhar Banco de Dados',
      url: `file://${cachePath}`,
      type: 'application/x-sqlite3',
    };

    await Share.open(shareOptions);
  }, []);

  return {shareDatabaseFile};
};

export default useShareDatabase;
