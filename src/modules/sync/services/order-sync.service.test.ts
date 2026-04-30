import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {UserDto} from '@/shared/types';

import {OrderSyncRepository} from '../repositories/order-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';

jest.mock('../repositories/sync-api.repository', () => ({
  SyncApiRepository: jest.fn(),
}));

jest.mock('../repositories/order-sync.repository', () => ({
  OrderSyncRepository: jest.fn(),
}));

jest.mock('../utils/order-date.util', () => ({
  createOrderSyncRange: jest.fn(() => ({
    startDate: '04/01/2026 00:00:00',
    endDate: '04/30/2026 00:00:00',
  })),
}));

import {OrderSyncService} from './order-sync.service';

describe('OrderSyncService', () => {
  const user = {Hash: 'hash', Codigo: 99} as UserDto;
  const organizationCode = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createService(response: unknown) {
    const syncApiRepository = {
      get: jest.fn().mockResolvedValue(response),
    } as unknown as SyncApiRepository;
    const orderSyncRepository = {
      replaceOrders: jest.fn().mockResolvedValue(undefined),
    } as unknown as OrderSyncRepository;

    return {
      service: new OrderSyncService(syncApiRepository, orderSyncRepository),
      syncApiRepository: syncApiRepository as {get: ReturnType<typeof jest.fn>},
      orderSyncRepository: orderSyncRepository as {
        replaceOrders: ReturnType<typeof jest.fn>;
      },
    };
  }

  it('requests orders using the expected sync date range and vendor code', async () => {
    const orders = [
      {
        Codigo: 123,
        DataEmissao: '2026-04-30',
        ModuloDeVenda: 1,
        OperacaoTipo: 1,
        Situacao: 1,
        CodigoClienteEndereco: null,
        TipoMovimentacao: {
          Codigo: 5,
          Descricao: 'Venda',
        },
        OperacaoSituacao: 1,
        DataOperacao: '2026-04-30',
        Itens: [
          {
            CodigoProduto: 7,
            Quantidade: 2,
            ValorCusto: 5,
            Descricao: 'Produto 7',
            ValorProduto: 12,
            UnidadeMedida: 'UN',
            ValorOriginalProduto: 12,
            ValorDesconto: '2',
          },
        ],
        MeiosPagamentos: [
          {
            Codigo: 1,
            CodigoVenda: null,
            CodigoContaReceberHistorico: null,
            CodigoOperadora: null,
            Valor: 22,
            ValorRecebido: 22,
            FormaPagamento: {
              Codigo: 8,
              Descricao: 'Pix',
              PermiteRecebimento: true,
              PermitePagamentoPromocao: true,
              Ativo: true,
              FormaPagamentoPadrao: 1,
              CondicoesPagamento: [],
              Identificador: 1,
              EmissaoCupomFiscalObrigatoria: false,
              UtilizaCreditoDevolucao: null,
              SolicitarDadosOperadoraBandeiraCartao: false,
              IsPrazo: false,
              IsCartao: false,
              IsRecebimentoEmConta: false,
            },
            CondicaoPagamento: {
              Codigo: 9,
              CodigoFormaPagamento: 8,
              QtdeParcelas: 1,
              IntervaloDias: 0,
              QtdeDiasParcelaInicial: 0,
              Ativo: true,
            },
            Titulos: [],
            CartaoBandeira: null,
            CartaoNSU: null,
            CodigoContaBancariaLancamento: null,
            DescricaoContaBancaria: '',
            IsPagamentoAntecipado: false,
            CodigoCreditoDevolucao: null,
            TipoCreditoDevolucao: null,
            Descricao: 'Pix',
          },
        ],
        Titulos: null,
        Historico: [],
        NFCeCodigoOperacaoNotaFiscal: 0,
        NFCeNumeroNotaFiscal: 0,
        NFCeSituacao: 0,
        NFeCodigoOperacaoNotaFiscal: 0,
        NFeNumeroNotaFiscal: 0,
        NFeSituacao: 0,
        CodigosLiberacaoSupervisor: [],
        Faturada: false,
        DataFaturamento: null,
        ResponsavelFaturamento: null,
        CodigoOrdemServico: null,
        CodigoOrcamento: null,
        TokenBoletos: null,
        NumeroPedidoCompra: null,
        Pessoa: {
          id: 1,
          Codigo: 10,
          isSincronizado: 1,
          Categoria: null,
          Regiao: null,
          DiaPagamento: 0,
          LimiteCompra: 0,
          BloquearCliente: false,
          ForcarAtualizacaoCadastro: false,
          CarenciaPagamento: 0,
          DescontoMaximo: 0,
          DataNascimento: null,
          TipoPreco: null,
          PessoaReferencia: [],
          MeiosPagamento: [],
          AcrescimoPercentual: null,
          Veiculos: null,
          PermiteComprarPazo: true,
          CodigoPessoa: 10,
          PessoaFJ: 1,
          RazaoSocial: 'Cliente',
          NomeFantasia: 'Cliente',
          CNPJCPF: '123',
          IERG: null,
          TipoContribuinte: 1,
          Observacao: null,
          Ativo: true,
          DataCadastro: '2026-04-30',
          ResponsavelCadastro: {
            CodigoUsuario: 1,
            Nome: 'Admin',
            DescontoMaximoVenda: 0,
            DescontoMaximoRecebimento: 0,
          },
          Enderecos: [],
          Contatos: [],
        },
        Observacao: null,
        CodigoOperacaoVinculada: 0,
        IsOperacaoProcessada: false,
      },
    ];
    const {service, syncApiRepository, orderSyncRepository} = createService({
      Resultado: orders,
      Status: 1,
      Mensagens: [],
    });

    await expect(service.sync(user, organizationCode)).resolves.toEqual({
      itemCount: 1,
      message: 'Pedidos sincronizados.',
    });

    expect(syncApiRepository.get).toHaveBeenCalledWith(
      'arc/operacao/prevenda?DataInicial=04%2F01%2F2026%2000%3A00%3A00&DataFinal=04%2F30%2F2026%2000%3A00%3A00&CodigoVendedor=99',
      user,
      organizationCode,
    );
    expect(orderSyncRepository.replaceOrders).toHaveBeenCalledWith([
      {
        Pedido: {
          Codigo: 123,
          DataEmissao: '2026-04-30',
          ModuloDeVenda: 1,
          OperacaoTipo: 1,
          Situacao: 1,
          CodigoClienteEndereco: null,
          TipoMovimentacaoCodigo: 5,
          TipoMovimentacaoDescricao: 'Venda',
          OperacaoSituacao: 1,
          DataOperacao: '2026-04-30',
          Observacao: null,
          CodigoOperacaoVinculada: 0,
          IsOperacaoProcessada: false,
          CodigoPessoa: 10,
        },
        ProdutosRelacao: [
          {
            iSincronizado: 1,
            CodigoPedido: 123,
            CodigoProduto: 7,
            Quantidade: 2,
            ValorCusto: 5,
            Descricao: 'Produto 7',
            ValorVenda: 12,
            UnidadeMedida: 'UN',
            ValorOriginalProduto: 12,
            ValorVendaDesconto: 11,
          },
        ],
        MeioPagamentoRelacao: [
          {
            CodigoPedido: 123,
            CodigoFormaPagamento: 8,
            CodigoCondicao: 9,
            ValorRecebido: 22,
            iSincronizado: 1,
          },
        ],
      },
    ]);
  });

  it('throws when the order sync endpoint fails', async () => {
    const {service, orderSyncRepository} = createService({
      Resultado: [],
      Status: 0,
      Mensagens: ['Erro'],
    });

    await expect(service.sync(user, organizationCode)).rejects.toThrow(
      'Falha ao sincronizar pedidos.',
    );
    expect(orderSyncRepository.replaceOrders).not.toHaveBeenCalled();
  });
});
