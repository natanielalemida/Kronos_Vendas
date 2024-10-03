import {knexConfig} from '../connection';

export const createEnderecoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('endereco'))) {
      await knexConfig.schema.createTable('endereco', table => {
        table.increments('id').primary();
        table.integer('Codigo').nullable().defaultTo(0).index();
        table.integer('CodigoPessoa').nullable().index();
        table.integer('Tipo').nullable().defaultTo(0).index();
        table.string('TipoDescricao').nullable().index();
        table.string('CEP').nullable().index();
        table.string('Logradouro').nullable().index();
        table.string('Numero').nullable();
        table.string('Bairro').nullable();
        table.string('Complemento').nullable();
        table.integer('CodigoMunicipio').nullable().index();
      });
      console.log('Table ENDERECO created successfully.');
    } else {
      console.log('Table ENDERECO already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
