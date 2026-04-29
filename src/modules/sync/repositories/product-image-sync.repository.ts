import {Knex} from 'knex';

import {knexConfig} from '@/database/connection';

import {SyncProductImageDto} from '../types/product-image-sync.types';
import {KnexBatchRepository} from './knex-batch.repository';

type ProductImageRow = {
  CodigoProduto: number;
  Image: string;
  IsDefault: number;
};

export class ProductImageSyncRepository {
  private readonly knexBatchRepository = new KnexBatchRepository();

  async replaceProductImages(
    productImages: SyncProductImageDto[],
  ): Promise<void> {
    const imageRows: ProductImageRow[] = productImages.map(productImage => ({
      CodigoProduto: productImage.CodigoProduto,
      Image: productImage.Image,
      IsDefault: productImage.IsDefault ? 1 : 0,
    }));

    await knexConfig.transaction(async (transaction: Knex.Transaction) => {
      await transaction('produto_imagem').del();

      await this.knexBatchRepository.insertInChunks(
        transaction,
        'produto_imagem',
        imageRows,
      );
    });
  }
}
