import {knexConfig} from '../connection';

export const createCondicaoPagamentoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('condicaoPagamento'))) {
      await knexConfig.schema.createTable('condicaoPagamento', table => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable();
        table.integer('CodigoFormaPagamento').notNullable().defaultTo(0);
        table.integer('QtdeParcelas').notNullable().defaultTo(0);
        table.integer('IntervaloDias').notNullable().defaultTo(0);
        table.integer('QtdeDiasParcelaInicial').notNullable().defaultTo(0);
        table.boolean('Ativo').notNullable();
        table.string('Tarifas').notNullable().defaultTo(0);

        table
          .foreign('CodigoFormaPagamento')
          .references('Codigo')
          .inTable('formaPagamento');
      });
      console.log('Table SETTINGS created successfully.');
    } else {
      console.log('Table SETTINGS already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
