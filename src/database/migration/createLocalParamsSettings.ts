import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createLocalParamsSettings = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('parametrosLocais'))) {
      await knexConfig.schema.createTable('parametrosLocais', (table: Knex.TableBuilder) => {
        table.increments('id').primary().index();
        table.string('Descricao').nullable();
        table.string('Valor').nullable();
        table.boolean('Ativo').notNullable();
      });
      logger.info(
        'DatabaseMigration',
        'Table PARAMETROSLOCAIS created successfully.',
      );
    } else {
      logger.info(
        'DatabaseMigration',
        'Table PARAMETROSLOCAIS already exists.',
      );
    }
  } catch (error) {
    logger.error(
      'DatabaseMigration',
      'Error creating PARAMETROSLOCAIS table.',
      error,
    );
  }
};
