import {useNavigation, useRoute} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';

import {useAppStore} from '@/shared/store/useAppStore';

import {
  calculateSelectedProductsTotal,
  formatCurrency,
  formatCustomerDocument,
  getCustomerDocumentLabel,
  getSelectedProductBackgroundColor,
  mapCustomerAddressLines,
} from '../helpers/sales-page.helpers';
import {
  SalesPageNavigation,
  SalesPageRoute,
} from '../types/sales-navigation.types';
import {UseSetupNewOrderPageResult} from '../types/sales-page.types';

export function useSetupNewOrderPage(): UseSetupNewOrderPageResult {
  const navigation = useNavigation() as SalesPageNavigation;
  const route = useRoute() as SalesPageRoute;
  const selectedCustomer = useAppStore(
    state => state.salesDraft.selectedCustomer,
  );
  const draftProducts = useAppStore(state => state.salesDraft.selectedProducts);

  const handleOpenProductActions = useCallback(() => {
    navigation.navigate('ListClientes', {
      screen: 'EditarProdutos',
    });
  }, [navigation]);

  const handleOpenCustomerHistory = useCallback(() => {
    navigation.navigate('PedidosCliente', {
      clienteId: selectedCustomer?.id,
    });
  }, [navigation, selectedCustomer?.id]);

  const handleOpenCustomers = useCallback(() => {
    navigation.navigate('ListClientes', {
      screen: 'SelectClientes',
    });
  }, [navigation]);

  const handleOpenProducts = useCallback(() => {
    navigation.navigate('ListClientes', {
      screen: 'SelectProdutos',
    });
  }, [navigation]);

  const handleGoToCheckout = useCallback(() => {
    navigation.navigate('ListClientes', {
      screen: 'FormaPagamento',
      params: {
        id: route.params?.id,
      },
    });
  }, [navigation, route.params?.id]);

  const customerSummary = useMemo(() => {
    const documentValue = formatCustomerDocument(selectedCustomer?.CNPJCPF);
    const documentLabel = getCustomerDocumentLabel(selectedCustomer?.CNPJCPF);

    return {
      id: selectedCustomer?.id,
      name: selectedCustomer?.NomeFantasia,
      document: documentValue ? `${documentLabel}: ${documentValue}` : '',
      addressLines: mapCustomerAddressLines(selectedCustomer?.Enderecos),
    };
  }, [selectedCustomer]);

  const selectedProducts = useMemo(() => {
    return draftProducts.map((product, index) => ({
      id: product.Codigo.toString(),
      code: product.Codigo,
      description: product.Descricao,
      quantity: product.Quantidade,
      unitPriceLabel: formatCurrency(product.ValorVendaDesconto),
      totalPriceLabel: formatCurrency(
        product.Quantidade * product.ValorVendaDesconto,
      ),
      note: product.Observacao,
      backgroundColor: getSelectedProductBackgroundColor(
        index,
        product.Codigo,
      ),
      onPress: handleOpenProductActions,
    }));
  }, [draftProducts, handleOpenProductActions]);

  return {
    customerSummary,
    hasSelectedCustomer: !!selectedCustomer,
    hasSelectedProducts: draftProducts.length > 0,
    selectedProducts,
    totalPriceLabel: formatCurrency(
      calculateSelectedProductsTotal(draftProducts),
    ),
    handleOpenProductActions,
    handleOpenCustomerHistory,
    handleOpenCustomers,
    handleOpenProducts,
    handleGoToCheckout,
  };
}
