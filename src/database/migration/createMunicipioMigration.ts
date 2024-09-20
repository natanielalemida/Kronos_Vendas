import {knexConfig} from '../connection';

export const createMunicipioTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('municipio'))) {
      await knexConfig.schema.createTable('municipio', table => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().defaultTo(0).index();
        table.integer('MunicipioCodigo').notNullable().defaultTo(0).index();
        table.integer('UFCodigo').notNullable().defaultTo(0).index();
        table.string('MunicipioNome').nullable().index();
        table.string('UFNome').nullable().index();
        table.string('UFSigla').nullable().index();
        table.string('PaisCodigo').notNullable();
        table.string('PaisNome').notNullable();
      });
      console.log('Table MUNICIPIO created successfully.');
    } else {
      console.log('Table MUNICIPIO already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
