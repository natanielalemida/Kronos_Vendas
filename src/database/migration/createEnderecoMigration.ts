import {knexConfig} from '../connection';

export const createEnderecoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('endereco'))) {
      await knexConfig.schema.createTable('endereco', table => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().defaultTo(0).index();
        table.integer('CodigoPessoa').notNullable().index();
        table.integer('Tipo').notNullable().defaultTo(0).index();
        table.string('TipoDescricao').nullable().index();
        table.string('CEP').nullable().index();
        table.string('Logradouro').nullable().index();
        table.string('Numero').notNullable();
        table.string('Bairro').notNullable();
        table.string('Complemento').nullable();
        table.integer('CodigoMunicipio').notNullable().index();
      });
      console.log('Table ENDERECO created successfully.');
    } else {
      console.log('Table ENDERECO already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
