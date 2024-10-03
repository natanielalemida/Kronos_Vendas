import {knexConfig} from '../connection';

export const createPessoaTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('pessoa'))) {
      await knexConfig.schema.createTable('pessoa', table => {
        table.increments('id').primary();
        table.integer('Codigo').nullable().index();

        table.integer('CategoriaCodigo').nullable().index();

        table.integer('RegiaoCodigo').nullable().index();
        table.integer('isSincronizado').nullable().defaultTo(0);
        table.integer('DiaPagamento').nullable().defaultTo(0);
        table.decimal('LimiteCompra', 10, 2).nullable().defaultTo(0.0);
        table.decimal('DescontoMaximo', 10, 2).nullable().defaultTo(0.0);
        table.string('TipoPreco').nullable();
        table.decimal('AcrescimoPercentual', 10, 2).nullable().defaultTo(0.0);
        table.boolean('PermiteComprarPazo').nullable().defaultTo(false);
        table.integer('CodigoPessoa').nullable().index();
        table.integer('PessoaFJ').nullable().defaultTo(0);
        table.string('RazaoSocial').nullable();
        table.string('NomeFantasia').nullable();
        table.string('CNPJCPF').nullable().unique();
        table.string('IERG').nullable();
        table.integer('TipoContribuinte').nullable().defaultTo(0);
        table.text('Observacao').nullable();
        table.boolean('Ativo').nullable().defaultTo(true);
        table
          .timestamp('DataCadastro')
          .notNullable()
          .defaultTo(knexConfig.fn.now());

        table
          .foreign('CategoriaCodigo')
          .references('Codigo')
          .inTable('categoria');
        table.foreign('RegiaoCodigo').references('Codigo').inTable('regiao');
      });
      console.log('Table PESSOA created successfully.');
    } else {
      console.log('Table PESSOA already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
