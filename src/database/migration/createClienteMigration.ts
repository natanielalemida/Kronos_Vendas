import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createPessoaTable = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('pessoa'))) {
      await knexConfig.schema.createTable('pessoa', (table: Knex.TableBuilder) => {
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
      logger.info('DatabaseMigration', 'Table PESSOA created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table PESSOA already exists.');
    }
  } catch (error) {
    logger.error('DatabaseMigration', 'Error creating PESSOA table.', error);
  }
};
