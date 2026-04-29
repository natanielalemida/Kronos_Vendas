export type OrderStatus = 0 | 1 | 2;

export type OrderListItem = {
  id: number;
  Codigo?: number;
  DataEmissao: string;
  NomeFantasia: string;
  ValorRecebido: number;
  Situacao: OrderStatus;
  PessoaCodigo?: number;
  idPessoa: number;
};

export type OrdersFilterOptions = {
  syncds: boolean;
  notSyncd: boolean;
  clienteId?: number;
};

export type OrderStatusPresentation = {
  label: string;
  color: string;
};
