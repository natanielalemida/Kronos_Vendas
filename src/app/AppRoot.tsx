import React from 'react';
import {View} from 'react-native';

import {AppBootstrapScreen} from './components/AppBootstrapScreen';
import {useInitializeApp} from './hooks/useInitializeApp';
import {AppRootNavigator} from './navigation/AppRootNavigator';
import {AppProviders} from './providers/AppProviders';
import {appRootStyles} from './AppRoot.styles';

export function AppRoot(): React.JSX.Element {
  const {isReady, error} = useInitializeApp();

  if (!isReady) {
    return <AppBootstrapScreen errorMessage={error?.message} />;
  }

  return (
    <AppProviders>
      <View style={appRootStyles.container}>
        <AppRootNavigator />
      </View>
    </AppProviders>
  );
}
