import {Knex} from 'knex';

import {knexConfig} from '../connection';
import {ensureColumn} from './helpers/schema';

const TABLE_NAME = 'muncipio_version';

export const ensureMunicipalityVersionSchemaMigration = async () => {
  const hasTable = await knexConfig.schema.hasTable(TABLE_NAME);

  if (!hasTable) {
    await knexConfig.schema.createTable(
      TABLE_NAME,
      (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().unique().index();
        table.integer('Versao').index();
        table.integer('TipoRecurso').index();
      },
    );

    return;
  }

  await ensureColumn(TABLE_NAME, 'Codigo', async () => {
    await knexConfig.schema.table(TABLE_NAME, (table: Knex.TableBuilder) => {
      table.integer('Codigo').notNullable().unique().index();
    });
  });

  await ensureColumn(TABLE_NAME, 'Versao', async () => {
    await knexConfig.schema.table(TABLE_NAME, (table: Knex.TableBuilder) => {
      table.integer('Versao').index();
    });
  });

  await ensureColumn(TABLE_NAME, 'TipoRecurso', async () => {
    await knexConfig.schema.table(TABLE_NAME, (table: Knex.TableBuilder) => {
      table.integer('TipoRecurso').index();
    });
  });
};
