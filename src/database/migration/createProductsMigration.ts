import {knexConfig} from '../connection';

export const createProductsMigration = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('produtos'))) {
      await knexConfig.schema.createTable('produtos', table => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable().index();
        table.string('Referencia').notNullable().defaultTo('');
        table.string('Descricao').notNullable();
        table.string('UnidadeMedida').notNullable();
        table.string('CodigoDeBarras').notNullable().index();
        table.decimal('ValorVenda', 10, 2).notNullable();
        table.boolean('VendeProdutoNoAtacado').notNullable().defaultTo(false);
        table.decimal('ValorVendaAtacado', 10, 2).notNullable().defaultTo(0.0);
        table.string('CodigoBarrasAtacado').defaultTo('').index();
        table.string('UnidadeMedidaAtacado').defaultTo('');
        table.boolean('PermiteFracionar').notNullable().defaultTo(false);
        table.integer('CodigoSetor').notNullable().index();
        table.integer('CodigoGrupo').notNullable().index();
        table.integer('CodigoSubGrupo').nullable().index();
        table.integer('CodigoMarca').nullable().index();
      });
      console.log('Table PRODUTOS created successfully.');
    } else {
      console.log('Table PRODUTOS already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
