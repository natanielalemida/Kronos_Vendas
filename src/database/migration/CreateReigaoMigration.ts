import {Knex} from 'knex';
import {knexConfig} from '../connection';

export const createRegiaoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('regiao'))) {
      await knexConfig.schema.createTable('regiao', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().unique().index();
        table.string('Descricao').notNullable().index();
      });
      console.log('Table REGIAO created successfully.');
    } else {
      console.log('Table REGIAO already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
