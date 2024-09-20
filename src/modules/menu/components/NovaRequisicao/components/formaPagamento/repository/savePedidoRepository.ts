import {knexConfig} from '../../../../../../../database/connection';

export default class SavePedidoRepository {
  async saveOne(pedido) {
    try {
      const [id] = await knexConfig('pedido').insert(pedido);
      return id;
    } catch (error) {
      console.log(error);
    }
  }

  async saveFormaPagamento(formaPagamento) {
    try {
      const [id] = await knexConfig('PedidoVinculoMeioPagamento').insert(
        formaPagamento,
      );
      return id;
    } catch (error) {
      console.log(error);
    }
  }

  async saveProdutos(Produtos) {
    try {
      const [id] = await knexConfig('PedidoVinculoProduto').insert(Produtos);
      return id;
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateOne(pedido, id) {
    try {
      await knexConfig('pedido').update(pedido).where('id', id);
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateFormaPagamento(formaPagamento, id) {
    try {
      await knexConfig('PedidoVinculoMeioPagamento')
        .update(formaPagamento)
        .where('id', id);
    } catch (error) {
      console.log(error);
    }
  }

  async UpdateProdutos(Produtos, id) {
    try {
      await knexConfig('PedidoVinculoProduto').update(Produtos).where('id', id);
    } catch (error) {
      console.log(error);
    }
  }
}
