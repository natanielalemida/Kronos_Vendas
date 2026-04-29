import {useNavigation, useRoute} from '@react-navigation/native';
import {useCallback, useMemo} from 'react';

import {useAppSession} from '@/shared/hooks/useAppSession';

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
  const {clienteOnContext, ProdutosSelecionados} = useAppSession();

  const handleOpenProductActions = useCallback(() => {
    navigation.navigate('ListClientes', {
      screen: 'EditarProdutos',
    });
  }, [navigation]);

  const handleOpenCustomerHistory = () => {
    navigation.navigate('PedidosCliente', {
      clienteId: clienteOnContext?.id,
    });
  };

  const handleOpenCustomers = () => {
    navigation.navigate('ListClientes', {
      screen: 'SelectClientes',
    });
  };

  const handleOpenProducts = () => {
    navigation.navigate('ListClientes', {
      screen: 'SelectProdutos',
    });
  };

  const handleGoToCheckout = () => {
    navigation.navigate('ListClientes', {
      screen: 'FormaPagamento',
      params: {
        id: route.params?.id,
      },
    });
  };

  const customerSummary = useMemo(() => {
    const documentValue = formatCustomerDocument(clienteOnContext?.CNPJCPF);
    const documentLabel = getCustomerDocumentLabel(clienteOnContext?.CNPJCPF);

    return {
      id: clienteOnContext?.id,
      name: clienteOnContext?.NomeFantasia,
      document: documentValue ? `${documentLabel}: ${documentValue}` : '',
      addressLines: mapCustomerAddressLines(clienteOnContext?.Enderecos),
    };
  }, [clienteOnContext]);

  const selectedProducts = useMemo(() => {
    return ProdutosSelecionados.map((product, index) => ({
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
  }, [ProdutosSelecionados, handleOpenProductActions]);

  return {
    customerSummary,
    hasSelectedCustomer: !!clienteOnContext,
    hasSelectedProducts: ProdutosSelecionados.length > 0,
    selectedProducts,
    totalPriceLabel: formatCurrency(
      calculateSelectedProductsTotal(ProdutosSelecionados),
    ),
    handleOpenProductActions,
    handleOpenCustomerHistory,
    handleOpenCustomers,
    handleOpenProducts,
    handleGoToCheckout,
  };
}
