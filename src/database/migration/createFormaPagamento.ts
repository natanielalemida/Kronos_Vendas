import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createFormaPagamentoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('formaPagamento'))) {
      await knexConfig.schema.createTable('formaPagamento', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable();
        table.string('Descricao').notNullable();
        table.boolean('PermiteRecebimento').notNullable();
        table.boolean('PermitePagamentoPromocao').notNullable();
        table.boolean('Ativo').notNullable();
        table.integer('FormaPagamentoPadrao').notNullable();
        table.integer('Identificador').notNullable().defaultTo(0);
        table.boolean('EmissaoCupomFiscalObrigatoria').notNullable();
        table.boolean('UtilizaCreditoDevolucao').notNullable();
        table.boolean('SolicitarDadosOperadoraBandeiraCartao').notNullable();
        table.boolean('IsPrazo').notNullable();
        table.boolean('IsCartao').notNullable();
        table.boolean('IsRecebimentoEmConta').notNullable();
      });
      logger.info(
        'DatabaseMigration',
        'Table FORMAPAGAMENTO created successfully.',
      );
    } else {
      logger.info(
        'DatabaseMigration',
        'Table FORMAPAGAMENTO already exists.',
      );
    }
  } catch (error) {
    logger.error(
      'DatabaseMigration',
      'Error creating FORMAPAGAMENTO table.',
      error,
    );
  }
};
