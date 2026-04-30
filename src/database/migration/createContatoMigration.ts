import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createContatoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('contato'))) {
      await knexConfig.schema.createTable('contato', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').nullable().unique().index();
        table.integer('CodigoPessoa').notNullable().index();
        table.integer('Tipo').notNullable().index();
        table.string('Contato').notNullable().index();
      });
      logger.info('DatabaseMigration', 'Table CONTATO created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table CONTATO already exists.');
    }
  } catch (error) {
    logger.error('DatabaseMigration', 'Error creating CONTATO table.', error);
  }
};
