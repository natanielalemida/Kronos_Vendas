import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createMunicipioTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('municipio'))) {
      await knexConfig.schema.createTable('municipio', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().defaultTo(0).index();
        table.integer('MunicipioCodigo').notNullable().defaultTo(0).index();
        table.integer('UFCodigo').notNullable().defaultTo(0).index();
        table.string('MunicipioNome').nullable().index();
        table.string('UFNome').nullable().index();
        table.string('UFSigla').nullable().index();
        table.string('PaisCodigo').notNullable();
        table.string('PaisNome').notNullable();
      });
      logger.info('DatabaseMigration', 'Table MUNICIPIO created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table MUNICIPIO already exists.');
    }
  } catch (error) {
    logger.error('DatabaseMigration', 'Error creating MUNICIPIO table.', error);
  }
};
