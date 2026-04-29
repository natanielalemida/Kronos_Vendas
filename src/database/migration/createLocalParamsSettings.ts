import {Knex} from 'knex';
import {knexConfig} from '../connection';

export const createLocalParamsSettings = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('parametrosLocais'))) {
      await knexConfig.schema.createTable('parametrosLocais', (table: Knex.TableBuilder) => {
        table.increments('id').primary().index();
        table.string('Descricao').nullable();
        table.string('Valor').nullable();
        table.boolean('Ativo').notNullable();
      });
      console.log('Table PARAMETROSLOCAIS created successfully.');
    } else {
      console.log('Table PARAMETROSLOCAIS already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
