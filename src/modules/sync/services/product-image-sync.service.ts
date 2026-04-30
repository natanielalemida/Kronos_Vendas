import {UserDto} from '@/shared/types';
import {AppStorageGateway} from '@/modules/storage/services/app-storage.gateway';
import {logger} from '@/shared/utils/logger';

import {ProductImageSyncRepository} from '../repositories/product-image-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {
  SyncProductImageDto,
  SyncProductImagesApiResponse,
} from '../types/product-image-sync.types';
import {SyncStepRunResult} from '../types/sync-run.types';
import {resolveSyncMessage} from '../helpers/resolve-sync-message.helper';

const PRODUCT_IMAGE_SYNC_FALLBACK_MESSAGE =
  'Falha ao sincronizar imagens dos produtos.';
const PRODUCT_IMAGE_SYNC_SKIPPED_MESSAGE =
  'Servidor de imagens indisponível no momento. Mantendo imagens locais.';

function shouldHideApiMessage(message: string): boolean {
  const normalizedMessage = message.trim().toLowerCase();

  return normalizedMessage.includes(
    'object reference not set to an instance of an object',
  );
}

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
      await this.syncApiRepository.get<
        SyncProductImagesApiResponse | SyncProductImageDto[]
      >(
        '/arc/produto/imagem/all',
        user,
        organizationCode,
      );
    const normalizedResponse = Array.isArray(response) ? undefined : response;
    const responseStatus = normalizedResponse?.Status ?? normalizedResponse?.status;
    const responseMessages = Array.isArray(normalizedResponse?.Mensagens)
      ? normalizedResponse.Mensagens
      : Array.isArray(normalizedResponse?.mensagens)
        ? normalizedResponse.mensagens
        : [];
    const productImages = Array.isArray(response)
      ? response
      : Array.isArray(normalizedResponse?.Resultado)
        ? normalizedResponse.Resultado
        : Array.isArray(normalizedResponse?.resultado)
          ? normalizedResponse.resultado
        : [];
    const isSuccessfulResponse = Array.isArray(response)
      ? true
      : responseStatus === 1 ||
        (responseStatus === undefined && productImages.length > 0);

    if (!isSuccessfulResponse) {
      const apiMessage = resolveSyncMessage(
        responseMessages,
        PRODUCT_IMAGE_SYNC_FALLBACK_MESSAGE,
      );
      const shouldSkipImageSync = shouldHideApiMessage(apiMessage);

      if (shouldSkipImageSync) {
        logger.info(
          'ProductImageSyncService',
          'Product image sync is temporarily unavailable. Keeping local images.',
          {
            apiMessage,
            hasArrayResponse: Array.isArray(response),
            messageCount: responseMessages.length,
            productImagesCount: productImages.length,
            status: responseStatus,
          },
        );

        await AppStorageGateway.setSyncProductImagesEnabled(false);

        return {
          itemCount: 0,
          message: PRODUCT_IMAGE_SYNC_SKIPPED_MESSAGE,
          skipped: true,
        };
      }

      logger.error(
        'ProductImageSyncService',
        'Product image sync returned an unsuccessful response.',
        {
          apiMessage,
          hasArrayResponse: Array.isArray(response),
          messageCount: responseMessages.length,
          productImagesCount: productImages.length,
          status: responseStatus,
        },
      );

      throw new Error(apiMessage);
    }

    await this.productImageSyncRepository.replaceProductImages(productImages);
    await AppStorageGateway.setSyncProductImagesEnabled(false);

    return {
      itemCount: productImages.length,
      message: 'Imagens dos produtos sincronizadas.',
    };
  }
}
