import {Ionicons} from '@expo/vector-icons';
import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';

import {Header} from '@/modules/components';

import {ConnectionSettingsModal} from '../components/ConnectionSettingsModal';
import {ConnectionCard} from '../components/ConnectionCard';
import {useSetupConnectionsPage} from '../hooks/useSetupConnectionsPage';
import {styles} from '../styles/connectionsPage.styles';
import {ConnectionsPageProps} from '../types/connections.types';

export default function ConnectionsPage({
  navigation,
}: ConnectionsPageProps): React.JSX.Element {
  const {
    activeConnectionId,
    connections,
    handlers,
    isModalVisible,
    selectedConnectionId,
  } = useSetupConnectionsPage({navigation});

  return (
    <View style={styles.container}>
      <Header
        label="Conexão"
        leftSize={25}
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={handlers.goBack}
      />

      <FlatList
        data={connections}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <ConnectionCard
            activeConnectionId={activeConnectionId}
            connection={item}
            onActivate={handlers.activateConnection}
            onDelete={handlers.confirmDelete}
            onEdit={handlers.openEditModal}
          />
        )}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handlers.openCreateModal}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <ConnectionSettingsModal
        isVisible={isModalVisible}
        onClose={handlers.closeModal}
        connectionId={selectedConnectionId}
      />
    </View>
  );
}
