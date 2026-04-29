import {useMemo, useState} from 'react';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useConnectionOptions} from '@/modules/storage/hooks/useConnectionOptions';

import {
  ConnectionDetails,
  UseSetupSettingsPageParams,
} from '../types/settings.types';

export function useSetupSettingsPage({navigation}: UseSetupSettingsPageParams) {
  const [isConnectionModalVisible, setConnectionModalVisible] = useState(false);
  const [isLocalParametersModalVisible, setLocalParametersModalVisible] =
    useState(false);
  const {activeConnectionId, terminal} = useAppStorage();
  const {getConnectionById} = useConnectionOptions();

  const details = useMemo<ConnectionDetails>(() => {
    const activeConnection = getConnectionById(activeConnectionId);

    if (!activeConnection) {
      return {
        host: '',
        codStore: '',
        terminal: terminal ? String(terminal) : '',
      };
    }

    return {
      host: activeConnection.host,
      codStore: activeConnection.codStore,
      terminal: activeConnection.terminal,
    };
  }, [activeConnectionId, getConnectionById, terminal]);

  return {
    details,
    modalState: {
      isConnectionModalVisible,
      isLocalParametersModalVisible,
    },
    handlers: {
      goBack: () => navigation.goBack(),
      openConnections: () => navigation.navigate('Conexoes'),
      toggleConnectionModal: () =>
        setConnectionModalVisible(current => !current),
      toggleLocalParametersModal: () =>
        setLocalParametersModalVisible(current => !current),
    },
  };
}
