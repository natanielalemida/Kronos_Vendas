export type CondicaoPagamentoDto = {
  Codigo: number;
  CodigoFormaPagamento: number;
  QtdeParcelas: number;
  IntervaloDias: number;
  QtdeDiasParcelaInicial: number;
  Ativo: boolean;
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
  UtilizaCreditoDevolucao: boolean;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  IsPrazo: boolean;
  IsCartao: boolean;
  IsRecebimentoEmConta: boolean;
};

export type FormaPagamentoDto = {
  Codigo: number;
  Descricao: string;
  PermiteRecebimento: boolean;
  PermitePagamentoPromocao: boolean;
  Ativo: boolean;
  FormaPagamentoPadrao: number;
  CondicoesPagamento: CondicaoPagamentoDto[];
  Identificador: number;
  EmissaoCupomFiscalObrigatoria: boolean;
  UtilizaCreditoDevolucao: boolean;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  IsPrazo: boolean;
  IsCartao: boolean;
  IsRecebimentoEmConta: boolean;
};

export type FormaPagamentoToSaveDto = {
  Codigo: number;
  Descricao: string;
  PermiteRecebimento: boolean;
  PermitePagamentoPromocao: boolean;
  Ativo: boolean;
  FormaPagamentoPadrao: number;
  Identificador: number;
  EmissaoCupomFiscalObrigatoria: boolean;
  UtilizaCreditoDevolucao: boolean;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  IsPrazo: boolean;
  IsCartao: boolean;
  IsRecebimentoEmConta: boolean;
};

export type pagamentoDtoDto = {
  Resultado: FormaPagamentoDto[];
  Status: number;
  Mensagens: any[];
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
  UtilizaCreditoDevolucao: boolean;
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
};

export interface FormaPagamentoOrganizada extends FormaPagamento {
  CondicaoPagamento: CondicaoPagamento[];
}
