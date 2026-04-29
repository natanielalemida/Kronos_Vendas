import {QueryClientProvider} from '@tanstack/react-query';
import {NavigationContainer} from '@react-navigation/native';
import React, {PropsWithChildren} from 'react';
import Toast from 'react-native-toast-message';
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';

import {queryClient} from '@/shared/lib/queryClient';

export function AppProviders({children}: PropsWithChildren): React.JSX.Element {
  return (
    <AutocompleteDropdownContextProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>{children}</NavigationContainer>
      </QueryClientProvider>
      <Toast />
    </AutocompleteDropdownContextProvider>
  );
}
