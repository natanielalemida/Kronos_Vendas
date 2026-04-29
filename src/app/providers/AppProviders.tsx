import {QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import React, {PropsWithChildren} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import {queryClient} from '@/shared/lib/queryClient';
import {appProvidersStyles} from './appProviders.styles';

export function AppProviders({children}: PropsWithChildren): React.JSX.Element {
  return (
    <GestureHandlerRootView style={appProvidersStyles.gestureRoot}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>{children}</NavigationContainer>
      </QueryClientProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}
