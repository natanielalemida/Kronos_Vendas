import {useCallback, useMemo, useState} from 'react';
import {Alert} from 'react-native';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useAppStorageActions} from '@/modules/storage/hooks/useAppStorageActions';
import {useConnectionOptions} from '@/modules/storage/hooks/useConnectionOptions';

import {ConnectionSettingsService} from '../services/connection-settings.service';
import {
  ConnectionCardProps,
  UseSetupConnectionsPageParams,
} from '../types/connections.types';

export function useSetupConnectionsPage({
  navigation,
}: UseSetupConnectionsPageParams) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    number | undefined
  >(undefined);

  const {connectionOptions, deleteConnectionOption} = useConnectionOptions();
  const {activeConnectionId} = useAppStorage();
  const {setActiveConnectionId} = useAppStorageActions();
  const connectionSettingsService = useMemo(
    () => new ConnectionSettingsService(),
    [],
  );
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedConnectionId(undefined);
  }, []);

  const activateConnection = useCallback(
    async (connection: ConnectionCardProps['connection']) => {
      await connectionSettingsService.activateConnection(connection);
    },
    [connectionSettingsService],
  );

  const deleteCurrentConnection = useCallback(
    async (id: number) => {
      if (
        connectionOptions.some(connection => connection.id === id) &&
        id === selectedConnectionId
      ) {
        setSelectedConnectionId(undefined);
      }

      if (activeConnectionId === id) {
        await connectionSettingsService.deleteCurrentSettings();
        await setActiveConnectionId(undefined);
      }

      await deleteConnectionOption(id);
    },
    [
      activeConnectionId,
      connectionOptions,
      connectionSettingsService,
      deleteConnectionOption,
      selectedConnectionId,
      setActiveConnectionId,
    ],
  );

  const confirmDelete = useCallback(
    (id: number, host: string) => {
      Alert.alert(
        'Excluir Conexão',
        `Tem certeza que deseja excluir esta esse host: ${host}?`,
        [
          {text: 'Cancelar', style: 'cancel'},
          {
            text: 'Excluir',
            onPress: () => deleteCurrentConnection(id),
            style: 'destructive',
          },
        ],
      );
    },
    [deleteCurrentConnection],
  );

  const handleGoBack = useCallback(() => {
    if (isModalVisible) {
      closeModal();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Settings');
  }, [closeModal, isModalVisible, navigation]);

  return {
    connections: connectionOptions,
    selectedConnectionId,
    isModalVisible,
    activeConnectionId,
    handlers: {
      activateConnection,
      closeModal,
      confirmDelete,
      goBack: handleGoBack,
      openCreateModal: () => setModalVisible(true),
      openEditModal: (id: number) => {
        setSelectedConnectionId(id);
        setModalVisible(true);
      },
    },
  };
}
