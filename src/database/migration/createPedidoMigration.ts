import {knexConfig} from '../connection';

export const createPedidoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('pedido'))) {
      await knexConfig.schema.createTable('pedido', table => {
        table.increments('id').primary();
        table.integer('Codigo').nullable().index();
        table.date('DataEmissao').notNullable();
        table.integer('ModuloDeVenda').notNullable();
        table.integer('OperacaoTipo').notNullable();
        table.integer('Situacao').notNullable();
        table.integer('CodigoClienteEndereco').nullable();
        table.integer('TipoMovimentacaoCodigo').notNullable();
        table.string('TipoMovimentacaoDescricao').notNullable();
        table.integer('OperacaoSituacao').notNullable();
        table.date('DataOperacao').notNullable();
        table.string('Observacao').nullable();
        table.integer('CodigoOperacaoVinculada').notNullable();
        table.boolean('IsOperacaoProcessada').notNullable();
        table.integer('CodigoPessoa').notNullable().index();
      });
      console.log('Table PEDIDO created successfully.');
    } else {
      console.log('Table PEDIDO already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
