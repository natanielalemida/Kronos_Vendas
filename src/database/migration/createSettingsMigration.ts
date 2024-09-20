import {knexConfig} from '../connection';

export const createSettingsTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('settings'))) {
      await knexConfig.schema.createTable('settings', table => {
        table.increments('id').primary();
        table.string('host', 50).notNullable();
        table.integer('cod_loja').notNullable().defaultTo(0);
        table.integer('terminal').notNullable().defaultTo(0);
      });
      console.log('Table SETTINGS created successfully.');
    } else {
      console.log('Table SETTINGS already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
