import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {SalesCheckoutPage} from '../pages/SalesCheckoutPage';
import {SalesEditProductsPage} from '../pages/SalesEditProductsPage';
import {SalesSelectCustomersPage} from '../pages/SalesSelectCustomersPage';
import {SalesSelectProductsPage} from '../pages/SalesSelectProductsPage';
import {SalesSummaryPage} from '../pages/SalesSummaryPage';
import {SalesNavigatorHeaderButton} from '../components/SalesNavigatorHeaderButton';
import {salesFlowNavigatorHeaderStyles} from '../styles/salesFlowNavigator.styles';
import {SalesPageNavigation} from '../types/sales-navigation.types';

export const salesFlowScreens = {
  EditarProdutoNaLista: SalesEditProductsPage,
  FormaPagamento: SalesCheckoutPage,
  Resumo: SalesSummaryPage,
  SelectClientes: SalesSelectCustomersPage,
  SelectProdutos: SalesSelectProductsPage,
};

export function getSelectCustomersOptions(
  navigation: SalesPageNavigation,
): NativeStackNavigationOptions {
  return {
    title: 'Clientes',
    headerStyle: salesFlowNavigatorHeaderStyles,
    headerTintColor: '#fff',
    headerLeft: () => (
      <SalesNavigatorHeaderButton
        iconName="arrow-back-outline"
        onPress={navigation.goBack}
        compact
      />
    ),
    headerRight: () => (
      <SalesNavigatorHeaderButton
        iconName="add-outline"
        onPress={() =>
          navigation.navigate('RouterCliente', {
            setClienteOnContextActive: true,
          })
        }
        compact
      />
    ),
  };
}

export function getSelectProductsOptions(
  navigation: SalesPageNavigation,
): NativeStackNavigationOptions {
  return {
    title: 'Produtos',
    headerStyle: salesFlowNavigatorHeaderStyles,
    headerTintColor: '#fff',
    headerRight: () => (
      <SalesNavigatorHeaderButton
        iconName="checkmark-sharp"
        onPress={() => navigation.navigate('Menu')}
        confirm
      />
    ),
  };
}

export function getEditProductsOptions(
  navigation: SalesPageNavigation,
): NativeStackNavigationOptions {
  return {
    title: 'Confirmar itens',
    headerStyle: salesFlowNavigatorHeaderStyles,
    headerTintColor: '#fff',
    headerRight: () => (
      <SalesNavigatorHeaderButton
        iconName="checkmark-sharp"
        onPress={() =>
          navigation.navigate('ListClientes', {
            screen: 'FormaPagamento',
          })
        }
      />
    ),
  };
}

export function getPaymentOptions(): NativeStackNavigationOptions {
  return {
    title: 'Forma de Pagamento',
    headerStyle: salesFlowNavigatorHeaderStyles,
    headerTintColor: '#fff',
  };
}

export function getPaymentScreenOptions({
  navigation,
}: {
  navigation: SalesPageNavigation;
}): NativeStackNavigationOptions {
  return {
    ...getPaymentOptions(),
    headerLeft: () => (
      <SalesNavigatorHeaderButton
        iconName="arrow-back"
        onPress={navigation.goBack}
        compact
      />
    ),
  };
}

export function getOrderSummaryOptions(): NativeStackNavigationOptions {
  return {
    headerStyle: salesFlowNavigatorHeaderStyles,
    headerTintColor: '#fff',
  };
}
