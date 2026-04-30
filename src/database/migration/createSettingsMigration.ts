import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createSettingsTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('settings'))) {
      await knexConfig.schema.createTable('settings', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.string('host', 50).notNullable();
        table.integer('cod_loja').notNullable().defaultTo(0);
        table.integer('terminal').notNullable().defaultTo(0);
        table.integer('idConecction').notNullable().defaultTo(0);
      });
      logger.info('DatabaseMigration', 'Table SETTINGS created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table SETTINGS already exists.');
    }
  } catch (error) {
    logger.error('DatabaseMigration', 'Error creating SETTINGS table.', error);
  }
};
