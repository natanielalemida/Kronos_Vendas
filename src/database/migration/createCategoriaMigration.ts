import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createCategoriaTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('categoria'))) {
      await knexConfig.schema.createTable('categoria', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().unique().index();
        table.string('Descricao').notNullable().index();
      });
      logger.info('DatabaseMigration', 'Table CATEGORIA created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table CATEGORIA already exists.');
    }
  } catch (error) {
    logger.error('DatabaseMigration', 'Error creating CATEGORIA table.', error);
  }
};
