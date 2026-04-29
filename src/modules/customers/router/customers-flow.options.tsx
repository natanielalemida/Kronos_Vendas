import {FontAwesome5, Ionicons} from '@expo/vector-icons';
import React from 'react';
import {TouchableOpacity} from 'react-native';

import {CustomersFlowBackButton} from '../components/CustomersFlowBackButton';
import {customersFlowNavigatorTheme} from '../styles/customersFlowNavigator.styles';
import {CustomersFlowScreenOptionsInput} from '../types/customers-router.types';

export function getCustomersFlowTabScreenOptions({
  isSyncedCustomer,
  routeName,
}: CustomersFlowScreenOptionsInput) {
  return {
    tabBarIcon: ({color, size}: {color: string; size: number}) => {
      const icons = {
        CriarOuEditarUsuario: 'person-outline',
        Endereco: 'location-outline',
        Resumo: 'clipboard-outline',
      } as const;

      return (
        <Ionicons
          name={icons[routeName as keyof typeof icons] ?? 'person-outline'}
          size={size}
          color={color}
        />
      );
    },
    ...customersFlowNavigatorTheme,
    tabBarButton: (props: React.ComponentProps<typeof TouchableOpacity>) =>
      isSyncedCustomer && routeName !== 'Resumo' ? null : (
        <TouchableOpacity {...props} />
      ),
  };
}

export function getCustomerFormScreenOptions(onBack: () => void) {
  return {
    title: 'Cliente',
    ...customersFlowNavigatorTheme,
    headerLeft: () => <CustomersFlowBackButton onPress={onBack} />,
  };
}

export function getCustomerAddressScreenOptions(onBack: () => void) {
  return {
    title: 'Endereço',
    ...customersFlowNavigatorTheme,
    headerLeft: () => <CustomersFlowBackButton onPress={onBack} />,
  };
}

export function getCustomerSummaryScreenOptions() {
  return {
    headerShown: false,
    tabBarLabel: 'Resumo',
    tabBarIcon: ({color, size}: {color: string; size: number}) => (
      <Ionicons name="clipboard-outline" size={size} color={color} />
    ),
  };
}

export function getCustomerHistoryScreenOptions() {
  return {
    headerShown: false,
    tabBarLabel: 'Histórico',
    tabBarIcon: ({color, size}: {color: string; size: number}) => (
      <FontAwesome5 name="history" size={size} color={color} />
    ),
  };
}
