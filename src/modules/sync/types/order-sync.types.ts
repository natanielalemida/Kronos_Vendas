import {ClienteDto} from './customer-sync.types';
import {
  CondicaoPagamentoDto,
  FormaPagamentoDto,
} from './payment-method-sync.types';

export type MeioPagamentoDto = {
  Codigo: number;
  CodigoVenda: number | null;
  CodigoContaReceberHistorico: number | null;
  CodigoOperadora: number | null;
  Valor: number;
  ValorRecebido: number;
  FormaPagamento: FormaPagamentoDto | null;
  CondicaoPagamento: CondicaoPagamentoDto | null;
  Titulos: TituloDto[];
  CartaoBandeira: string | null;
  CartaoNSU: string | null;
  CodigoContaBancariaLancamento: number | null;
  DescricaoContaBancaria: string;
  IsPagamentoAntecipado: boolean;
  CodigoCreditoDevolucao: number | null;
  TipoCreditoDevolucao: string | null;
  Descricao: string;
};

export type TipoMovimentacaoDto = {
  Codigo: number;
  Descricao: string;
};

export type TituloDto = {
  Codigo: number;
  CodigoHistorico: number | null;
  CodigoHistoricoOrigemRenegociacao: number | null;
  CodigoVenda: number;
  NumeroParcela: number;
  NumeroDocumento: string;
  Emissao: string;
  Vencimento: string;
  ValorBruto: number;
  ValorTarifa: number;
  ValorJurosDevido: number;
  ValorJurosCobrado: number;
  ValorJurosRecebimento: number;
  ValorDescontoRecebimento: number;
  Situacao: number;
  Cliente: ClienteDto;
  Operadora: string | null;
  MeioPagamento: MeioPagamentoDto | null;
  FormaPagamento: FormaPagamentoDto | null;
  RegistroRecebimento: string;
  Recebimento: string;
  ValorRecebimento: number;
  RegistroAguardoPagamento: string | null;
  DataLimiteAguardarPagamento: string | null;
  TituloSelecionado: boolean;
  ValorDescontadoDaTarifa: number;
  ValorMaisJurosDevido: number;
  ValorRecebido: number;
  DiasAtraso: number;
  SituacaoString: string;
};

export type VendaDto = {
  Codigo: number;
  CodCaixa: number;
  DataEmissao: string;
  CodigoOrdemServico: number | null;
  ModuloDeVenda: number;
  MeiosPagamentos: MeioPagamentoDto[];
  Titulos: TituloDto[] | null;
  Historico: unknown[];
  NFCeCodigoOperacaoNotaFiscal: number;
  NFCeNumeroNotaFiscal: number;
  NFCeSituacao: number;
  NFeCodigoOperacaoNotaFiscal: number;
  NFeNumeroNotaFiscal: number;
  NFeSituacao: number;
  CodigosLiberacaoSupervisor: unknown[];
  OperacaoTipo: number;
  Faturada: boolean;
  DataFaturamento: string | null;
  ResponsavelFaturamento: string | null;
  Situacao: number;
  CodigoClienteEndereco: number | null;
  CodigoOrcamento: number | null;
  TipoMovimentacao: TipoMovimentacaoDto;
  OperacaoSituacao: number;
  DataOperacao: string;
  Itens: OrderProductItemDto[];
  TokenBoletos: string | null;
  NumeroPedidoCompra: string | null;
  Pessoa: ClienteDto;
  Observacao: string | null;
  CodigoOperacaoVinculada: number;
  IsOperacaoProcessada: boolean;
};

export type OrderProductItemDto = {
  CodigoProduto: number;
  Quantidade: number;
  ValorCusto: number;
  Descricao: string;
  ValorProduto: number;
  UnidadeMedida: string;
  ValorOriginalProduto: number;
  ValorDesconto: string;
};

export type PedidoResponse = {
  Resultado: VendaDto[];
  Status: number;
  Mensagens: string[];
};

export type PedidoToSaveDto = {
  Pedido: {
    Codigo: number;
    DataEmissao: string;
    ModuloDeVenda: number;
    OperacaoTipo: number;
    Situacao: number;
    CodigoClienteEndereco: number | null;
    TipoMovimentacaoCodigo: number;
    TipoMovimentacaoDescricao: string;
    OperacaoSituacao: number;
    DataOperacao: string;
    Observacao: string | null;
    CodigoOperacaoVinculada: number;
    IsOperacaoProcessada: boolean;
    CodigoPessoa: number;
  };
  ProdutosRelacao: SyncOrderProductRelationRecord[];
  MeioPagamentoRelacao: SyncOrderPaymentRelationRecord[];
};

export type SyncOrderProductRelationRecord = {
  iSincronizado: 1;
  CodigoPedido: number;
  CodigoProduto: number;
  Quantidade: number;
  ValorCusto: number;
  Descricao: string;
  ValorVenda: number;
  UnidadeMedida: string;
  ValorOriginalProduto: number;
  ValorVendaDesconto: number | null;
};

export type SyncOrderPaymentRelationRecord = {
  CodigoPedido: number;
  CodigoFormaPagamento: number;
  CodigoCondicao: number;
  ValorRecebido: number;
  iSincronizado: 1;
};
