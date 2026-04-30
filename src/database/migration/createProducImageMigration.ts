import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createProductsImageMigration = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('produto_imagem'))) {
      await knexConfig.schema.createTable('produto_imagem', (table: Knex.TableBuilder) => {
        table.increments('id').primary().index();
        table.integer('Codigo').notNullable().index();
        table.integer('CodigoProduto').notNullable();
        table.boolean('IsDefault').notNullable();
        table.text('Image').notNullable();
      });
      logger.info(
        'DatabaseMigration',
        'Table PRODUTO_IMAGEM created successfully.',
      );
    } else {
      logger.info(
        'DatabaseMigration',
        'Table PRODUTO_IMAGEM already exists.',
      );
    }
  } catch (error) {
    logger.error(
      'DatabaseMigration',
      'Error creating PRODUTO_IMAGEM table.',
      error,
    );
  }
};
