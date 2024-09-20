import {knexConfig} from '../connection';

export const createFormaPagamentoTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('formaPagamento'))) {
      await knexConfig.schema.createTable('formaPagamento', table => {
        table.increments('id').primary();
        table.integer('Codigo').notNullable();
        table.string('Descricao').notNullable();
        table.boolean('PermiteRecebimento').notNullable();
        table.boolean('PermitePagamentoPromocao').notNullable();
        table.boolean('Ativo').notNullable();
        table.integer('FormaPagamentoPadrao').notNullable();
        table.integer('Identificador').notNullable().defaultTo(0);
        table.boolean('EmissaoCupomFiscalObrigatoria').notNullable();
        table.boolean('UtilizaCreditoDevolucao').notNullable();
        table.boolean('SolicitarDadosOperadoraBandeiraCartao').notNullable();
        table.boolean('IsPrazo').notNullable();
        table.boolean('IsCartao').notNullable();
        table.boolean('IsRecebimentoEmConta').notNullable();
      });
      console.log('Table FORMA-PAGAMENTO created successfully.');
    } else {
      console.log('Table FORMA-PAGAMENTO already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
