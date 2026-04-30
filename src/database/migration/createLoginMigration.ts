import {Knex} from 'knex';
import {knexConfig} from '../connection';
import {logger} from '../../shared/utils/logger';

export const createUsuariosMigration = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('usuarios'))) {
      await knexConfig.schema.createTable('usuarios', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('codigo').notNullable().index();
        table.integer('codigo_pessoa').notNullable();
        table.string('referencia').notNullable().defaultTo('');
        table.string('login').notNullable().unique();
        table.string('senha');
        table.string('senha_confirmacao');
        table.string('hash');
        table.string('cargo_descricao').notNullable();
        table.decimal('desconto_maximo_venda', 10, 2).defaultTo(0.00);
        table.decimal('desconto_maximo_recebimento', 10, 2).defaultTo(0.00);
        table.boolean('usuario_administrador').defaultTo(false);
        table.string('image');
        table.timestamp('created_at').defaultTo(knexConfig.fn.now());
        table.timestamp('updated_at').defaultTo(knexConfig.fn.now());
      });
      logger.info('DatabaseMigration', 'Table USUARIOS created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table USUARIOS already exists.');
    }
  } catch (error) {
    logger.error('DatabaseMigration', 'Error creating USUARIOS table.', error);
  }
};

export const createPrivilegiosMigration = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('privilegios'))) {
      await knexConfig.schema.createTable('privilegios', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.integer('usuario_id').unsigned().notNullable();
        table.string('privilegio').notNullable();
        table.foreign('usuario_id').references('usuarios.id').onDelete('CASCADE');
      });
      logger.info('DatabaseMigration', 'Table PRIVILEGIOS created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table PRIVILEGIOS already exists.');
    }
  } catch (error) {
    logger.error(
      'DatabaseMigration',
      'Error creating PRIVILEGIOS table.',
      error,
    );
  }
};

export const createEmpresaJson = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('empresaLogin'))) {
      await knexConfig.schema.createTable('empresaLogin', (table: Knex.TableBuilder) => {
        table.integer('empresaJson').unsigned().notNullable();
        table.string('codigo_empresa').notNullable();
      });
      logger.info('DatabaseMigration', 'Table empresaLogin created successfully.');
    } else {
      logger.info('DatabaseMigration', 'Table empresaLogin already exists.');
    }
  } catch (error) {
    logger.error(
      'DatabaseMigration',
      'Error creating empresaLogin table.',
      error,
    );
  }
};
