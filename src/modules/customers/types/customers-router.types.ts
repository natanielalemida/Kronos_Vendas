export type CustomersFlowRouteParams = {
  setClienteOnContextActive?: boolean;
};

export type CustomersFlowTabParamList = {
  CriarOuEditarUsuario: undefined;
  Endereco: undefined;
  Resumo: CustomersFlowRouteParams | undefined;
  Histórico: {clienteId: number} | undefined;
};

export type CustomersFlowBackButtonProps = {
  onPress: () => void;
};

export type CustomersFlowScreenOptionsInput = {
  isSyncedCustomer: boolean;
  routeName: keyof CustomersFlowTabParamList;
};
