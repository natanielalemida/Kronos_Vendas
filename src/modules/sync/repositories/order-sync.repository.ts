import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';

import {
  PedidoToSaveDto,
  SyncOrderPaymentRelationRecord,
  SyncOrderProductRelationRecord,
} from '../types/order-sync.types';
import {KnexBatchRepository} from './knex-batch.repository';

type OrderRow = PedidoToSaveDto['Pedido'];

export class OrderSyncRepository {
  private readonly knexBatchRepository = new KnexBatchRepository();

  async replaceOrders(orderPayloads: PedidoToSaveDto[]): Promise<void> {
    const orderRows: OrderRow[] = orderPayloads.map(payload => payload.Pedido);
    const productRelationRows: SyncOrderProductRelationRecord[] =
      orderPayloads.flatMap(payload => payload.ProdutosRelacao);
    const paymentRelationRows: SyncOrderPaymentRelationRecord[] =
      orderPayloads.flatMap(payload => payload.MeioPagamentoRelacao);

    await knexConfig.transaction(async (transaction: Knex.Transaction) => {
      await transaction('PedidoVinculoMeioPagamento')
        .where('iSincronizado', 1)
        .del();
      await transaction('PedidoVinculoProduto').where('iSincronizado', 1).del();
      await transaction('pedido')
        .whereNotNull('Codigo')
        .orWhere('Codigo', '!=', 0)
        .del();

      await this.knexBatchRepository.insertInChunks(
        transaction,
        'pedido',
        orderRows,
      );
      await this.knexBatchRepository.insertInChunks(
        transaction,
        'PedidoVinculoProduto',
        productRelationRows,
      );
      await this.knexBatchRepository.insertInChunks(
        transaction,
        'PedidoVinculoMeioPagamento',
        paymentRelationRows,
      );
    });
  }

  async updateOrder(order: OrderRow, id: number): Promise<void> {
    await knexConfig('pedido').update(order).where('id', id);
  }

  async updateOrderProductRelations(
    productRelations: SyncOrderProductRelationRecord[],
    orderId: number,
  ): Promise<void> {
    await knexConfig.transaction(async (transaction: Knex.Transaction) => {
      for (const productRelation of productRelations) {
        await transaction('PedidoVinculoProduto')
          .update({...productRelation, iSincronizado: 1})
          .where({CodigoPedido: orderId})
          .andWhere({CodigoProduto: productRelation.CodigoProduto});
      }
    });
  }

  async updateOrderPaymentRelations(
    paymentRelations: SyncOrderPaymentRelationRecord[],
    orderId: number,
  ): Promise<void> {
    await knexConfig.transaction(async (transaction: Knex.Transaction) => {
      for (const paymentRelation of paymentRelations) {
        await transaction('PedidoVinculoMeioPagamento')
          .update({...paymentRelation, iSincronizado: 1})
          .where({CodigoPedido: orderId})
          .andWhere({
            CodigoFormaPagamento: paymentRelation.CodigoFormaPagamento,
          })
          .andWhere({CodigoCondicao: paymentRelation.CodigoCondicao});
      }
    });
  }
}
