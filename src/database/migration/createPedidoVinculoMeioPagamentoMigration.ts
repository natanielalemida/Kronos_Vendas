import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createPedidoVinculoMeioPagamentoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('PedidoVinculoMeioPagamento'))) {
      await knexConfig.schema.createTable(
        'PedidoVinculoMeioPagamento',
        (table: Knex.TableBuilder) => {
          table.increments('id').primary();
          table.integer('CodigoPedido').notNullable().index();
          table.integer('CodigoFormaPagamento').notNullable().index();
          table.integer('CodigoCondicao').notNullable().index();
          table.decimal('ValorRecebido').notNullable();
          table.boolean('iSincronizado');
        },
      );
      logger.info(
        'DatabaseMigration',
        'Table PEDIDO_VINCULO_MEIO_PAGAMENTO created successfully.',
      );
    } else {
      logger.info(
        'DatabaseMigration',
        'Table PEDIDO_VINCULO_MEIO_PAGAMENTO already exists.',
      );
    }
  } catch (error) {
    logger.error(
      'DatabaseMigration',
      'Error creating PEDIDO_VINCULO_MEIO_PAGAMENTO table.',
      error,
    );
  }
};
