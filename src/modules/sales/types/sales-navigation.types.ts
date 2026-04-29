export type SalesDraftRouteParams = {
  id?: number;
};

export type SalesNestedRouteName =
  | 'SelectClientes'
  | 'SelectProdutos'
  | 'EditarProdutos'
  | 'FormaPagamento';

export type SalesPageNavigation = {
  goBack: () => void;
  navigate: {
    (routeName: 'PedidosCliente', params: {clienteId?: number}): void;
    (
      routeName: 'ListClientes',
      params: {
        screen: SalesNestedRouteName;
        params?: SalesDraftRouteParams;
      },
    ): void;
    (
      routeName: 'RouterCliente',
      params?: {setClienteOnContextActive?: boolean},
    ): void;
    (routeName: 'Menu'): void;
    (
      routeName: 'resumoPedidoNavigation',
      params: {id: number; goBack: boolean; idCliente: number | null | undefined},
    ): void;
  };
};

export type SalesPageRoute = {
  params?: SalesDraftRouteParams;
};

export type SalesFlowParamList = {
  SelectClientes: undefined;
  SelectProdutos: undefined;
  EditarProdutos: undefined;
  FormaPagamento: SalesDraftRouteParams | undefined;
  ResumoPedido: undefined;
};

export type SalesCheckoutPageNavigation = SalesPageNavigation;
export type SalesCheckoutPageRoute = {
  params?: SalesDraftRouteParams;
};

export type SalesNavigatorHeaderButtonProps = {
  iconName:
    | 'arrow-back-outline'
    | 'add-outline'
    | 'checkmark-sharp'
    | 'arrow-back';
  onPress: () => void;
  compact?: boolean;
  confirm?: boolean;
};
