import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';

import {ProdutoDto} from '../types/product-sync.types';
import {KnexBatchRepository} from './knex-batch.repository';

type ProductRow = Omit<ProdutoDto, 'images'>;

export class ProductSyncRepository {
  private readonly knexBatchRepository = new KnexBatchRepository();

  async replaceProducts(products: ProductRow[]): Promise<void> {
    await knexConfig.transaction(async (transaction: Knex.Transaction) => {
      await transaction('produtos').del();

      await this.knexBatchRepository.insertInChunks(
        transaction,
        'produtos',
        products,
      );
    });
  }
}
