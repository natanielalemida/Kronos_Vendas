import {knexConfig} from '../connection';
  
  export const createProductsImageMigration = async () => {
    try {
      if (!(await knexConfig.schema.hasTable('produto_imagem'))) {
        await knexConfig.schema.createTable('produto_imagem', table => {
            table.increments('id').primary().index();
            table.integer('Codigo').notNullable().index();
            table.integer('CodigoProduto').notNullable();
            table.boolean('IsDefault').notNullable();
            table.text('Image').notNullable();
        });
        console.log('Table produto_imagem created successfully.');
      } else {
        console.log('Table produto_imagem already exists.');
      }
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };
  