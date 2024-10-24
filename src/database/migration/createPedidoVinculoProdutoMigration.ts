import {knexConfig} from '../connection';

export const createPedidoVinculoProdutoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('PedidoVinculoProduto'))) {
      await knexConfig.schema.createTable('PedidoVinculoProduto', table => {
        table.increments('id').primary();
        table.integer('CodigoPedido').notNullable().index();
        table.integer('CodigoProduto').notNullable().index();
        table.decimal('Quantidade').notNullable();
        table.string('Descricao');
        table.decimal('ValorCusto');
        table.decimal('ValorVenda');
        table.decimal('ValorOriginalProduto');
        table.string('UnidadeMedida');
        table.decimal('ValorVendaDesconto');
        table.boolean('iSincronizado');
      });
      console.log('Table PEDIDO-VINCULO-PRODUTO created successfully.');
    } else {
      console.log('Table PEDIDO-VINCULO-PRODUTO already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
