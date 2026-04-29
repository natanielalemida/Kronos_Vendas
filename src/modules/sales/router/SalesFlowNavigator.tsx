import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  getEditProductsOptions,
  getOrderSummaryOptions,
  getPaymentScreenOptions,
  getSelectCustomersOptions,
  getSelectProductsOptions,
  salesFlowScreens,
} from './salesFlowNavigator.options';
import {
  SalesFlowParamList,
  SalesPageNavigation,
} from '../types/sales-navigation.types';

const Stack = createNativeStackNavigator<SalesFlowParamList>();

export function SalesFlowNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SelectClientes"
        component={salesFlowScreens.SelectClientes}
        options={({navigation}) =>
          getSelectCustomersOptions(
            navigation as unknown as SalesPageNavigation,
          )
        }
      />
      <Stack.Screen
        name="SelectProdutos"
        component={salesFlowScreens.SelectProdutos}
        options={({navigation}) =>
          getSelectProductsOptions(navigation as unknown as SalesPageNavigation)
        }
      />
      <Stack.Screen
        name="EditarProdutos"
        component={salesFlowScreens.EditarProdutoNaLista}
        options={({navigation}) =>
          getEditProductsOptions(navigation as unknown as SalesPageNavigation)
        }
      />
      <Stack.Screen
        name="FormaPagamento"
        component={salesFlowScreens.FormaPagamento}
        options={({navigation}) =>
          getPaymentScreenOptions({
            navigation: navigation as unknown as SalesPageNavigation,
          })
        }
      />
      <Stack.Screen
        name="ResumoPedido"
        component={salesFlowScreens.Resumo}
        options={getOrderSummaryOptions()}
      />
    </Stack.Navigator>
  );
}
