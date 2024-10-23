import {knexConfig} from '../connection';

export const createPedidoVinculoMeioPagamentoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('PedidoVinculoMeioPagamento'))) {
      await knexConfig.schema.createTable(
        'PedidoVinculoMeioPagamento',
        table => {
          table.increments('id').primary();
          table.integer('CodigoPedido').notNullable().index();
          table.integer('CodigoFormaPagamento').notNullable().index();
          table.integer('CodigoCondicao').notNullable().index();
          table.decimal('ValorRecebido').notNullable();
          table.boolean('iSincronizado');
        },
      );
      console.log('Table PEDIDO-VINCULO-MEIOPAGAMENTO created successfully.');
    } else {
      console.log('Table PEDIDO-VINCULO-MEIOPAGAMENTO already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
