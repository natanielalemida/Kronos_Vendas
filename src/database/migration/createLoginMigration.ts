import { knexConfig } from '../connection';

export const createUsuariosMigration = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('usuarios'))) {
      await knexConfig.schema.createTable('usuarios', (table) => {
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
      console.log('Table USUARIOS created successfully.');
    } else {
      console.log('Table USUARIOS already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

export const createPrivilegiosMigration = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('privilegios'))) {
      await knexConfig.schema.createTable('privilegios', (table) => {
        table.increments('id').primary();
        table.integer('usuario_id').unsigned().notNullable();
        table.string('privilegio').notNullable();
        table.foreign('usuario_id').references('usuarios.id').onDelete('CASCADE');
      });
      console.log('Table PRIVILEGIOS created successfully.');
    } else {
      console.log('Table PRIVILEGIOS already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

export const createEmpresaJson = async () => {
  try {
    if (!(await knexConfig.schema.hasTable('empresaLogin'))) {
      await knexConfig.schema.createTable('empresaLogin', (table) => {
        table.integer('empresaJson').unsigned().notNullable();
        table.string('codigo_empresa').notNullable();
      });
      console.log('Table empresaLogin created successfully.');
    } else {
      console.log('Table empresaLogin already exists.');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
};
