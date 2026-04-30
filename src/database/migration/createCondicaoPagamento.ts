import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createCondicaoPagamentoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('condicaoPagamento'))) {
      await knexConfig.schema.createTable('condicaoPagamento', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable();
        table.integer('CodigoFormaPagamento').notNullable().defaultTo(0);
        table.integer('QtdeParcelas').notNullable().defaultTo(0);
        table.integer('IntervaloDias').notNullable().defaultTo(0);
        table.integer('QtdeDiasParcelaInicial').notNullable().defaultTo(0);
        table.boolean('Ativo').notNullable();
        table.string('Tarifas').notNullable();

        table
          .foreign('CodigoFormaPagamento')
          .references('Codigo')
          .inTable('formaPagamento');
      });
      logger.info(
        'DatabaseMigration',
        'Table CONDICAOPAGAMENTO created successfully.',
      );
    } else {
      logger.info(
        'DatabaseMigration',
        'Table CONDICAOPAGAMENTO already exists.',
      );
    }
  } catch (error) {
    logger.error(
      'DatabaseMigration',
      'Error creating CONDICAOPAGAMENTO table.',
      error,
    );
  }
};
