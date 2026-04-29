import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

import {colors} from '@/shared/theme/tokens/colors';
import {appBootstrapScreenStyles} from './app-bootstrap-screen.styles';
import {AppBootstrapScreenProps} from './app-bootstrap-screen.types';

export function AppBootstrapScreen({
  errorMessage,
}: AppBootstrapScreenProps): React.JSX.Element {
  return (
    <View style={appBootstrapScreenStyles.container}>
      <ActivityIndicator size="large" color={colors.success} />
      <Text style={appBootstrapScreenStyles.title}>
        {errorMessage ? 'Initialization failed' : 'Initializing app...'}
      </Text>
      {errorMessage ? (
        <Text style={appBootstrapScreenStyles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}
