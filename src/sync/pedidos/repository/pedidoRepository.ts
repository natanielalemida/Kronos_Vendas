import {knexConfig} from '../../../database/connection';
import {PedidoToSaveDto} from '../type';

export default class PedidoRepository {
  async savePedidosBatch(pedidos: PedidoToSaveDto[]) {
    const batchSize = 100;
    const batches = [];

    for (let i = 0; i < pedidos.length; i += batchSize) {
      const batch = pedidos.slice(i, i + batchSize);
      batches.push(batch);
    }

    await knexConfig.transaction(async trx => {
      for (const batch of batches) {
        await trx('pedido').insert(batch);
      }
    });
  }

  async saveVinculoProdutoBatch(pedidos: PedidoToSaveDto[]) {
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < pedidos.length; i += batchSize) {
      const batch = pedidos.slice(i, i + batchSize);
      batches.push(batch);
    }

    await knexConfig.transaction(async trx => {
      for (const batch of batches) {
        await trx('PedidoVinculoProduto').insert(batch);
      }
    });
  }

  async saveVinculoPagamentoBatch(pedidos: PedidoToSaveDto[]) {
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < pedidos.length; i += batchSize) {
      const batch = pedidos.slice(i, i + batchSize);
      batches.push(batch);
    }

    await knexConfig.transaction(async trx => {
      for (const batch of batches) {
        await trx('PedidoVinculoMeioPagamento').insert(batch);
      }
    });
  }

  async updatePedido(pedido: any, id: number) {
    try {
      await knexConfig('pedido').update(pedido).where('id', id);
    } catch (error) {
      console.error(error);
    }
  }

  async updateVinculoProduto(produtos: any, id: number) {
    try {
      await knexConfig('PedidoVinculoProduto')
        .update(produtos)
        .where('CodigoPedido', id);
    } catch (error) {
      console.log(error);
    }
  }

  async updateVinculoMeioPagamento(meioPagamentos: any, id: number) {
    try {
      await knexConfig('PedidoVinculoMeioPagamento')
        .update(meioPagamentos)
        .where('CodigoPedido', id);
    } catch (error) {
      console.log(error);
    }
  }
}
