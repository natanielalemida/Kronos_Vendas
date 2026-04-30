import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createRegiaoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('regiao'))) {
      await knexConfig.schema.createTable('regiao', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().unique().index();
        table.string('Descricao').notNullable().index();
      });
      logger.info('DatabaseMigration', 'Table REGIAO created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table REGIAO already exists.');
    }
  } catch (error) {
    logger.error('DatabaseMigration', 'Error creating REGIAO table.', error);
  }
};
