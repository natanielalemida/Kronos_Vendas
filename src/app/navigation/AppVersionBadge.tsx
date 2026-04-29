import React from 'react';
import {Text, View} from 'react-native';

import {appVersion} from '../../shared/config/appVersion';
import {appVersionBadgeStyles} from './appVersionBadge.styles';

export function AppVersionBadge(): React.JSX.Element {
  return (
    <View style={appVersionBadgeStyles.container}>
      <Text style={appVersionBadgeStyles.text}>v{appVersion}</Text>
    </View>
  );
}
