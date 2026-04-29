import {useCallback, useMemo} from 'react';

import {ConnectionOption} from '../types/app-storage.types';
import {useAppStorage} from './useAppStorage';
import {useAppStorageActions} from './useAppStorageActions';

export function useConnectionOptions() {
  const {connectionOptions} = useAppStorage();
  const {removeConnectionOption, upsertConnectionOption} =
    useAppStorageActions();

  const getConnectionById = useCallback(
    (connectionId?: number): ConnectionOption | undefined => {
      if (!connectionId) {
        return undefined;
      }

      return connectionOptions.find(
        connectionOption => connectionOption.id === connectionId,
      );
    },
    [connectionOptions],
  );

  const sortedConnectionOptions = useMemo(() => {
    return [...connectionOptions].sort((leftConnection, rightConnection) =>
      leftConnection.host.localeCompare(rightConnection.host),
    );
  }, [connectionOptions]);

  return {
    connectionOptions: sortedConnectionOptions,
    getConnectionById,
    saveConnectionOption: upsertConnectionOption,
    deleteConnectionOption: removeConnectionOption,
  };
}
