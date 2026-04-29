import React from 'react';
import {View} from 'react-native';

import {Header} from '@/modules/components';

import {ConnectionSettingsModal} from '../components/ConnectionSettingsModal';
import {LocalParametersModal} from '../components/LocalParametersModal';
import {SettingsOptionButton} from '../components/SettingsOptionButton';
import {useSetupSettingsPage} from '../hooks/useSetupSettingsPage';
import {styles} from '../styles/settingsPage.styles';
import {SettingsPageProps} from '../types/settings.types';

export default function SettingsPage({
  navigation,
}: SettingsPageProps): React.JSX.Element {
  const {details, handlers, modalState} = useSetupSettingsPage({navigation});

  return (
    <View style={styles.container}>
      <Header
        label="Configurações"
        leftSize={25}
        leftColor="white"
        leftIcon="arrow-back"
        onPressLeftIcon={handlers.goBack}
        leftButtonDisable={!details.host}
      />

      <SettingsOptionButton
        title="Conexão Atual"
        iconName="wifi-sharp"
        onPress={handlers.openConnections}
        details={[
          `Host: ${details.host}`,
          `Cod Loja: ${details.codStore}`,
          `Terminal: ${details.terminal}`,
        ]}
      />

      <SettingsOptionButton
        title="Parâmetros Locais"
        iconName="settings"
        onPress={handlers.toggleLocalParametersModal}
      />

      <LocalParametersModal
        isVisible={modalState.isLocalParametersModalVisible}
        onClose={handlers.toggleLocalParametersModal}
      />

      <ConnectionSettingsModal
        isVisible={modalState.isConnectionModalVisible}
        onClose={handlers.toggleConnectionModal}
      />
    </View>
  );
}
