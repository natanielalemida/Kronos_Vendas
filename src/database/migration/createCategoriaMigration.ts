import {knexConfig} from '../connection';

export const createCategoriaTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('categoria'))) {
      await knexConfig.schema.createTable('categoria', table => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().unique().index();
        table.string('Descricao').notNullable().index();
      });
      console.log('Table CATEGORIA created successfully.');
    } else {
      console.log('Table CATEGORIA already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
