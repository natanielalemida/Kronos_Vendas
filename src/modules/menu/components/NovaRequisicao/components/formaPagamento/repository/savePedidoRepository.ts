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

  async UpdateFormaPagamento(formaPagamentos, id) {
    const trx = await knexConfig.transaction();

    await trx('PedidoVinculoMeioPagamento').where('CodigoPedido', id).del();
    try {
      for (const formaPagamento of formaPagamentos) {
        // Verifica se o item existe
        await trx('PedidoVinculoMeioPagamento')
          .insert(formaPagamento)
          .where('CodigoPedido');
      }

      await trx.commit();
    } catch (error) {
      // Rollback na transação em caso de erro
      await trx.rollback();
      console.log(error);
    }
  }

  async UpdateProdutos(produtos, id) {
    const trx = await knexConfig.transaction();

    try {
      const produtosParaAtualizar = produtos.filter(
        produto => produto.CodigoProduto,
      );
      const novosProdutos = [];

      await trx('PedidoVinculoProduto').where('CodigoPedido', id).del();

      for (const produto of produtosParaAtualizar) {
        // Verifica se o item existe
        const existingItem = await trx('PedidoVinculoProduto')
          .where('CodigoPedido', id)
          .andWhere('CodigoProduto', produto.CodigoProduto)
          .first();

        if (existingItem) {
          // Se o item existir, atualiza
          await trx('PedidoVinculoProduto')
            .update(produto)
            .where('CodigoPedido', id)
            .andWhere('CodigoProduto', produto.CodigoProduto);
        } else {
          // Se o item não existir, adiciona um novo
          novosProdutos.push({...produto, CodigoPedido: id});
        }
      }

      // Executa a inserção em massa
      if (novosProdutos.length > 0) {
        await trx('PedidoVinculoProduto').insert(novosProdutos);
      }

      // Commit na transação
      await trx.commit();
    } catch (error) {
      // Rollback na transação em caso de erro
      await trx.rollback();
      console.log(error);
    }
  }
}
