import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useRoute} from '@react-navigation/native';

import {OrdersPage} from '@/modules/orders';
import {useAppSession} from '@/shared/hooks/useAppSession';

import {useSaveCustomerForm} from '../hooks/useSaveCustomerForm';
import CustomerAddressPage from '../pages/CustomerAddressPage';
import CustomerFormPage from '../pages/CustomerFormPage';
import CustomerSummaryPage from '../pages/CustomerSummaryPage';
import {
  getCustomerAddressScreenOptions,
  getCustomerFormScreenOptions,
  getCustomerHistoryScreenOptions,
  getCustomerSummaryScreenOptions,
  getCustomersFlowTabScreenOptions,
} from './customers-flow.options';
import {
  CustomersFlowRouteParams,
  CustomersFlowTabParamList,
} from '../types/customers-router.types';

const Tab = createBottomTabNavigator<CustomersFlowTabParamList>();

export function CustomersFlowNavigator() {
  const {handleClearForm} = useSaveCustomerForm();
  const {form} = useAppSession();
  const route = useRoute();
  const params = (route.params as CustomersFlowRouteParams | undefined) ?? {};
  const isSyncedCustomer = form.IsSincronizado === 1;

  return (
    <Tab.Navigator
      initialRouteName={form.id ? 'Resumo' : 'CriarOuEditarUsuario'}
      screenOptions={({route: currentRoute}) =>
        getCustomersFlowTabScreenOptions({
          isSyncedCustomer,
          routeName: currentRoute.name,
        })
      }>
      {!isSyncedCustomer ? (
        <>
          <Tab.Screen
            name="CriarOuEditarUsuario"
            component={CustomerFormPage}
            options={getCustomerFormScreenOptions(handleClearForm)}
          />
          <Tab.Screen
            name="Endereco"
            component={CustomerAddressPage}
            options={getCustomerAddressScreenOptions(handleClearForm)}
          />
        </>
      ) : null}

      <Tab.Screen
        name="Resumo"
        component={CustomerSummaryPage}
        options={getCustomerSummaryScreenOptions()}
        initialParams={params}
      />

      {form.id ? (
        <Tab.Screen
          name="Histórico"
          component={OrdersPage}
          options={getCustomerHistoryScreenOptions()}
          initialParams={{clienteId: form.id}}
        />
      ) : null}
    </Tab.Navigator>
  );
}
