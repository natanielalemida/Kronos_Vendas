import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createPedidoVinculoProdutoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('PedidoVinculoProduto'))) {
      await knexConfig.schema.createTable('PedidoVinculoProduto', (table: Knex.TableBuilder) => {
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
      logger.info(
        'DatabaseMigration',
        'Table PEDIDO_VINCULO_PRODUTO created successfully.',
      );
    } else {
      logger.info(
        'DatabaseMigration',
        'Table PEDIDO_VINCULO_PRODUTO already exists.',
      );
    }
  } catch (error) {
    logger.error(
      'DatabaseMigration',
      'Error creating PEDIDO_VINCULO_PRODUTO table.',
      error,
    );
  }
};
