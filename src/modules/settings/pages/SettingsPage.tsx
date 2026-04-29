import React from 'react';
import {Switch, Text, View} from 'react-native';

import {colors} from '@/modules/styles';

import {useSetupSettingsPage} from '../hooks/useSetupSettingsPage';
import {styles} from '../styles/settingsPage.styles';

export default function SettingsPage() {
  const {data, handlers} = useSetupSettingsPage();

  return (
    <View style={styles.container}>
      <View style={styles.optionRow}>
        <Text style={styles.text}>Usar apenas online</Text>
        <Switch
          disabled={data.isPending}
          trackColor={{false: '#767577', true: colors.arcGreen}}
          thumbColor={
            data.isOnlineOnlyEnabled ? colors.confirmButton : '#f4f3f4'
          }
          onValueChange={handlers.handleToggleOnlineOnly}
          value={data.isOnlineOnlyEnabled}
        />
      </View>
    </View>
  );
}
