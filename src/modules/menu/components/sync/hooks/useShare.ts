import {useCallback} from 'react';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {Platform} from 'react-native';

const useShareDatabase = () => {
  const shareDatabaseFile = useCallback(async () => {
    // Definindo o caminho do banco de dados para Android e iOS
    const originalPath =
      Platform.OS === 'android'
        ? '/data/data/com.kronos_vendas/databases/KronosVendas.db'
        : `${RNFS.LibraryDirectoryPath}/LocalDatabase/KronosVendas.db`; // Caminho para iOS

    const cachePath = `${RNFS.CachesDirectoryPath}/KronosVendas.db`;

    try {
      // Copiando o arquivo para o diretório de cache para compartilhamento
      await RNFS.copyFile(originalPath, cachePath);

      const shareOptions = {
        title: 'Compartilhar Banco de Dados',
        url: `file://${cachePath}`,
        type: 'application/x-sqlite3',
      };

      // Compartilhando o arquivo
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Erro ao compartilhar o banco de dados:', error);
    }
  }, []);

  return {shareDatabaseFile};
};

export default useShareDatabase;
