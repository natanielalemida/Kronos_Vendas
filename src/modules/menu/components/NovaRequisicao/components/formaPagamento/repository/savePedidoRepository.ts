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

    try {
      const formaPagamentosParaAtualizar = formaPagamentos.filter(
        p => p.CodigoFormaPagamento,
      );
      const novasFormaPagamentos = [];

      for (const formaPagamento of formaPagamentosParaAtualizar) {
        // Verifica se o item existe
        const existingItem = await trx('PedidoVinculoMeioPagamento')
          .where('CodigoPedido', id)
          .first();

        if (existingItem) {
          // Se o item existir, atualiza
          await trx('PedidoVinculoMeioPagamento')
            .update(formaPagamento)
            .where('CodigoPedido', id);
        } else {
          // Se o item não existir, adiciona um novo
          novasFormaPagamentos.push({...formaPagamento, CodigoPedido: id});
        }
      }

      // Executa a inserção em massa para novas formas de pagamento
      if (novasFormaPagamentos.length > 0) {
        await trx('PedidoVinculoMeioPagamento').insert(novasFormaPagamentos);
      }

      // Commit na transação
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
