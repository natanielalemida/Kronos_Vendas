import {VendaDto} from '@/modules/sync/types/order-sync.types';
import {OrderStatus} from './order.types';

import {OrderListItem, OrdersFilterOptions} from './order.types';

export type OrderSearchRow = {
  id: number;
  Codigo: number | null;
  Situacao: OrderStatus;
  DataEmissao: string;
  NomeFantasia: string;
  idPessoa: number;
  PessoaCodigo: number | null;
  ValorRecebido: number;
};

export type OrderSyncRow = {
  CodigoProduto: number;
  DescricaoPedido: string;
  Quantidade: number;
  ValorVenda: number;
  UnidadeMedida: string;
  ValorVendaDesconto: number | null;
  CodigoFormaPagamento: number;
  FormaPagamentoPadrao: number;
  Descricao: string;
  CodigoCondicao: number;
  IsPrazo: boolean;
  QtdeParcelas: number;
  QtdeDiasParcelaInicial: number;
  IntervaloDias: number;
  ValorRecebido: number;
  CodigoPedidoTable: number | null;
  DataEmissao: string;
  Observacao: string | null;
  CNPJCPF: string;
  PessoaCodigo: number;
  CodigoPessoa: number;
  NomeFantasia: string;
  TipoPreco: string | null;
  idPessoa: number;
};

export type MappedOrderSyncItem = {
  CodigoProduto: number;
  Descricao: string;
  Quantidade: number;
  ValorUnitario: number;
  ValorVenda: number;
  ValorTotal: number;
  UnidadeMedida: string;
  ValorOriginalProduto: number;
  ValorVendaDesconto: number;
  ValorDesconto: string;
};

export type MappedOrderTitle = {
  NumeroParcela: number;
  Emissao: Date;
  Vencimento: Date;
  ContaReceberTituloSituacaoSituacao: number;
  ValorBruto: number;
  FormaPagamento: {
    Codigo: number;
  };
};

export type MappedOrderPaymentMethod = {
  CodigoVenda: null;
  CodigoContaReceberHistorico: null;
  CodigoOperadora: null;
  Valor: number;
  ValorRecebido: number;
  FormaPagamento: {
    IsPrazo: boolean;
    Codigo: number;
    FormaPagamentoPadrao: number;
    Descricao: string;
    CondicoesPagamento: {
      Codigo: number;
    }[];
  };
  CondicaoPagamento: {
    Codigo: number;
  };
  Titulos: MappedOrderTitle[] | null;
};

export type OrderSyncApiMessage = {
  conteudo: string;
};

export type OrderSyncApiResponse = {
  Mensagens?: unknown[];
  mensagens?: OrderSyncApiMessage[];
  Resultado?: VendaDto;
};

export type OrderControllerFetchParams = OrdersFilterOptions;

export type OrderControllerSendParams = {
  authenticatedUser: {
    Hash: string;
  };
  companyCode: number;
  customerToSync: {
    Codigo?: number;
  };
  id: number;
  terminal: number;
};

export type OrderListQueryResult = OrderListItem[];
