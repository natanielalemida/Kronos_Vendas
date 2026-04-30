import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createEnderecoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('endereco'))) {
      await knexConfig.schema.createTable('endereco', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').nullable().defaultTo(0).index();
        table.integer('CodigoPessoa').nullable().index();
        table.integer('Tipo').nullable().defaultTo(0).index();
        table.string('TipoDescricao').nullable().index();
        table.string('CEP').nullable().index();
        table.string('Logradouro').nullable().index();
        table.string('Numero').nullable();
        table.string('Bairro').nullable();
        table.string('Complemento').nullable();
        table.integer('CodigoMunicipio').nullable().index();
      });
      logger.info('DatabaseMigration', 'Table ENDERECO created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table ENDERECO already exists.');
    }
  } catch (error) {
    logger.error('DatabaseMigration', 'Error creating ENDERECO table.', error);
  }
};
