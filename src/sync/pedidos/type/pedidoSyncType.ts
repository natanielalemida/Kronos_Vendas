import {ClienteDto} from '../../clientes/type';
import {ProdutoDto} from '../../products/type';

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

export type FormaPagamentoDto = {
  Codigo: number;
  Descricao: string | null;
  PermiteRecebimento: boolean;
  PermitePagamentoPromocao: boolean;
  Ativo: boolean;
  FormaPagamentoPadrao: number;
  CondicoesPagamento: CondicaoPagamentoDto[];
  Operadora: string | null;
  Identificador: number;
  EmissaoCupomFiscalObrigatoria: boolean;
  UtilizaCreditoDevolucao: boolean;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  CodigoContaBancaria: number | null;
  IsPrazo: boolean;
  IsCartao: boolean;
  IsRecebimentoEmConta: boolean;
};

export type CondicaoPagamentoDto = {
  Codigo: number;
  CodigoFormaPagamento: number;
  QtdeParcelas: number;
  IntervaloDias: number;
  QtdeDiasParcelaInicial: number;
  Ativo: boolean;
  Tarifas: number | null;
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
  Historico: any[]; // Caso seja necessário, definir a estrutura
  NFCeCodigoOperacaoNotaFiscal: number;
  NFCeNumeroNotaFiscal: number;
  NFCeSituacao: number;
  NFeCodigoOperacaoNotaFiscal: number;
  NFeNumeroNotaFiscal: number;
  NFeSituacao: number;
  CodigosLiberacaoSupervisor: any[]; // Caso seja necessário, definir a estrutura
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
  Itens: ProdutoDto[];
  TokenBoletos: string | null;
  NumeroPedidoCompra: string | null;
  Pessoa: ClienteDto;
  Observacao: string | null;
  CodigoOperacaoVinculada: number;
  IsOperacaoProcessada: boolean;
};

export type PedidoResponse = {
  Resultado: VendaDto[];
  Status: number;
  Mensagens: any[];
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
  ProdutosRelacao: {CodigoProduto: number; CodigoPedido: number}[];
  MeioPagamentoRelacao: {
    CodigoFormaPagamento: number;
    CodigoPedido: number;
    CodigoCondicao: number;
  }[];
};
