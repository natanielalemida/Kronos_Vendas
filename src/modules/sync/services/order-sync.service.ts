import {UserDto} from '@/shared/types';

import {OrderSyncRepository} from '../repositories/order-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {
  PedidoResponse,
  PedidoToSaveDto,
  VendaDto,
} from '../types/order-sync.types';
import {SyncStepRunResult} from '../types/sync-run.types';
import {createOrderSyncRange} from '../utils/order-date.util';

function mapOrderPayload(order: VendaDto): PedidoToSaveDto {
  return {
    Pedido: {
      Codigo: order.Codigo,
      DataEmissao: order.DataEmissao,
      ModuloDeVenda: order.ModuloDeVenda,
      OperacaoTipo: order.OperacaoTipo,
      Situacao: order.Situacao,
      CodigoClienteEndereco: order.CodigoClienteEndereco,
      TipoMovimentacaoCodigo: order.TipoMovimentacao.Codigo,
      TipoMovimentacaoDescricao: order.TipoMovimentacao.Descricao,
      OperacaoSituacao: order.OperacaoSituacao,
      DataOperacao: order.DataOperacao,
      Observacao: order.Observacao,
      CodigoOperacaoVinculada: order.CodigoOperacaoVinculada,
      IsOperacaoProcessada: order.IsOperacaoProcessada,
      CodigoPessoa: order.Pessoa.Codigo,
    },
    ProdutosRelacao: order.Itens.map(product => {
      const discountPerItem =
        Number(product.ValorDesconto) / Number(product.Quantidade);
      const discountedValue = Number(product.ValorDesconto)
        ? Number(product.ValorProduto) - discountPerItem
        : null;

      return {
        iSincronizado: 1,
        CodigoPedido: order.Codigo,
        CodigoProduto: product.CodigoProduto,
        Quantidade: product.Quantidade,
        ValorCusto: product.ValorCusto,
        Descricao: product.Descricao,
        ValorVenda: product.ValorProduto,
        UnidadeMedida: product.UnidadeMedida,
        ValorOriginalProduto: product.ValorOriginalProduto,
        ValorVendaDesconto:
          discountedValue !== null ? Number(discountedValue.toFixed(2)) : null,
      };
    }),
    MeioPagamentoRelacao: order.MeiosPagamentos.flatMap(paymentMethod => {
      if (!paymentMethod.FormaPagamento || !paymentMethod.CondicaoPagamento) {
        return [];
      }

      return [
        {
          CodigoPedido: order.Codigo,
          CodigoFormaPagamento: paymentMethod.FormaPagamento.Codigo,
          CodigoCondicao: paymentMethod.CondicaoPagamento.Codigo,
          ValorRecebido: paymentMethod.ValorRecebido,
          iSincronizado: 1 as const,
        },
      ];
    }),
  };
}

export class OrderSyncService {
  constructor(
    private readonly syncApiRepository = new SyncApiRepository(),
    private readonly orderSyncRepository = new OrderSyncRepository(),
  ) {}

  async sync(
    user: UserDto,
    organizationCode: number,
  ): Promise<SyncStepRunResult> {
    const {endDate, startDate} = createOrderSyncRange(30);
    const endpoint = `arc/operacao/prevenda?DataInicial=${encodeURIComponent(
      startDate,
    )}&DataFinal=${encodeURIComponent(endDate)}&CodigoVendedor=${user.Codigo}`;

    const response = await this.syncApiRepository.get<PedidoResponse>(
      endpoint,
      user,
      organizationCode,
    );

    if (response.Status !== 1) {
      throw new Error('Failed to synchronize orders.');
    }

    await this.orderSyncRepository.replaceOrders(
      response.Resultado.map(mapOrderPayload),
    );

    return {
      itemCount: response.Resultado.length,
      message: 'Orders synchronized.',
    };
  }

  async updateOne(id: number, order: VendaDto): Promise<void> {
    const mappedOrder = mapOrderPayload(order);

    await this.orderSyncRepository.updateOrder(mappedOrder.Pedido, id);
    await this.orderSyncRepository.updateOrderProductRelations(
      mappedOrder.ProdutosRelacao,
      id,
    );
    await this.orderSyncRepository.updateOrderPaymentRelations(
      mappedOrder.MeioPagamentoRelacao,
      id,
    );
  }
}
