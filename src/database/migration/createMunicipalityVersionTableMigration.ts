import {Knex} from 'knex';

import {knexConfig} from '../connection';

export const createMunicipalityVersionTableMigration = async () => {
  const hasTable = await knexConfig.schema.hasTable('muncipio_version');

  if (hasTable) {
    return;
  }

  await knexConfig.schema.createTable(
    'muncipio_version',
    (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.integer('Codigo').notNullable().unique().index();
      table.integer('Versao').index();
      table.integer('TipoRecurso').index();
    },
  );
};
