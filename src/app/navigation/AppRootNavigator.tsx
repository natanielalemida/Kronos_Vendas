import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {ProductDetailsPage} from '@/modules/products';
import {ConnectionsPage, LoginPage, SettingsPage} from '@/modules/auth';
import {CustomersFlowNavigator} from '@/modules/customers';
import {OrdersPage, OrderSummaryPage} from '@/modules/orders';
import {SalesFlowNavigator} from '@/modules/sales';

import Menu from './menu/router';
import {RootStackParamList} from './types/root-navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen name="Conexoes" component={ConnectionsPage} />
      <Stack.Screen name="ResumoPedido" component={ProductDetailsPage} />
      <Stack.Screen name="PedidosCliente" component={OrdersPage} />
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen
        name="resumoPedidoNavigation"
        component={OrderSummaryPage}
      />
      <Stack.Screen name="ListClientes" component={SalesFlowNavigator} />
      <Stack.Screen name="RouterCliente" component={CustomersFlowNavigator} />
    </Stack.Navigator>
  );
}
