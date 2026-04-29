export type SalesCheckout = {
  ValorBruto: number;
  Desconto: number;
  ValorTotal: number;
  Observacao: string;
};

export type SelectedOrderSummary = {
  id: number;
  Codigo: number | undefined;
  DataEmissao: string;
  NomeFantasia: string;
};
