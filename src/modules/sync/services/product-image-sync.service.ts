import {UserDto} from '@/shared/types';
import {AppStorageGateway} from '@/modules/storage/services/app-storage.gateway';

import {ProductImageSyncRepository} from '../repositories/product-image-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {SyncProductImagesApiResponse} from '../types/product-image-sync.types';
import {SyncStepRunResult} from '../types/sync-run.types';

export class ProductImageSyncService {
  constructor(
    private readonly syncApiRepository: SyncApiRepository,
    private readonly productImageSyncRepository: ProductImageSyncRepository,
  ) {}

  async sync(
    user: UserDto,
    organizationCode: number,
  ): Promise<SyncStepRunResult> {
    const response =
      await this.syncApiRepository.get<SyncProductImagesApiResponse>(
        '/arc/produto/imagem/all',
        user,
        organizationCode,
      );

    if (response.Status !== 1) {
      throw new Error('Failed to synchronize product images.');
    }

    await this.productImageSyncRepository.replaceProductImages(
      response.Resultado,
    );
    await AppStorageGateway.setSyncProductImagesEnabled(false);

    return {
      itemCount: response.Resultado.length,
      message: 'Product images synchronized.',
    };
  }
}
