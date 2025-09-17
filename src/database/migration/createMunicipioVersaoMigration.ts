import {knexConfig} from '../connection';

export const createMunicipioVersaoMigrations = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('muncipio_version'))) {
      await knexConfig.schema.createTable('muncipio_version', table => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().unique().index();
        table.integer('Versao').index();
        table.integer('TipoRecurso').index();
      });
      console.log('Table CATEGORIA created successfully.');
    } else {
      console.log('Table CATEGORIA already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
