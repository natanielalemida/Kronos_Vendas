export type CondicaoPagamentoDto = {
  Codigo: number;
  CodigoFormaPagamento: number;
  QtdeParcelas: number;
  IntervaloDias: number;
  QtdeDiasParcelaInicial: number;
  Ativo: boolean;
  Tarifas?: number | null;
};

export type FormaPagamentoFromQueryDto = {
  id: number;
  Codigo: number;
  Descricao: string;
  PermiteRecebimento: boolean;
  PermitePagamentoPromocao: boolean;
  Ativo: boolean;
  FormaPagamentoPadrao: number;
  Identificador: number;
  EmissaoCupomFiscalObrigatoria: boolean;
  UtilizaCreditoDevolucao: boolean | null;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  IsPrazo: boolean;
  IsCartao: boolean;
  IsRecebimentoEmConta: boolean;
};

export type FormaPagamentoDto = {
  Codigo: number;
  Descricao: string | null;
  PermiteRecebimento: boolean;
  PermitePagamentoPromocao: boolean;
  Ativo: boolean;
  FormaPagamentoPadrao: number;
  CondicoesPagamento: CondicaoPagamentoDto[];
  Operadora?: string | null;
  Identificador: number;
  EmissaoCupomFiscalObrigatoria: boolean;
  UtilizaCreditoDevolucao: boolean | null;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  CodigoContaBancaria?: number | null;
  IsPrazo: boolean;
  IsCartao: boolean;
  IsRecebimentoEmConta: boolean;
};

export type SyncPaymentMethodsApiResponse = {
  Resultado: FormaPagamentoDto[];
  Status: number;
  Mensagens: string[];
};

export type FormaPagamento = {
  id: number;
  Codigo: number;
  Descricao: string;
  EmissaoCupomFiscalObrigatoria: boolean;
  FormaPagamentoPadrao: number;
  Identificador: number;
  IntervaloDias: number;
  IsCartao: boolean;
  IsPrazo: boolean;
  IsRecebimentoEmConta: boolean;
  PermitePagamentoPromocao: boolean;
  PermiteRecebimento: boolean;
  QtdeDiasParcelaInicial: number;
  QtdeParcelas: number;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  Tarifas: string;
  UtilizaCreditoDevolucao: boolean | null;
  CondicaoPagamento: CondicaoPagamento[];
};

export type CondicaoPagamento = {
  Codigo: number;
  CodigoFormaPagamento: number;
  QtdeParcelas: number;
  IntervaloDias: number;
  QtdeDiasParcelaInicial: number;
  Ativo: boolean;
  Tarifas: string;
  ValorPago?: number;
};

export interface FormaPagamentoOrganizada extends FormaPagamento {
  CondicaoPagamento: CondicaoPagamento[];
}
