import {knexConfig} from '../connection';

export const createContatoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('contato'))) {
      await knexConfig.schema.createTable('contato', table => {
        table.increments('id').primary();
        table.integer('Codigo').nullable().unique().index();
        table.integer('CodigoPessoa').notNullable().index();
        table.integer('Tipo').notNullable().index();
        table.string('Contato').notNullable().index();
      });
      console.log('Table CATEGORIA created successfully.');
    } else {
      console.log('Table CATEGORIA already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
