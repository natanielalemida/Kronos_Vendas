import {
  afterEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import {UserDto} from '@/shared/types';

import {ProductImageSyncRepository} from '../repositories/product-image-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {ProductImageSyncService} from './product-image-sync.service';

jest.mock('@/modules/storage/services/app-storage.gateway', () => ({
  AppStorageGateway: {
    setSyncProductImagesEnabled: jest.fn(),
  },
}));

const {AppStorageGateway} = jest.requireMock(
  '@/modules/storage/services/app-storage.gateway',
) as {
  AppStorageGateway: {
    setSyncProductImagesEnabled: ReturnType<typeof jest.fn>;
  };
};

describe('ProductImageSyncService', () => {
  const user = {Hash: 'user-hash'} as UserDto;
  const organizationCode = 1;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function createService(response: unknown) {
    const getMock = jest.fn<() => Promise<unknown>>();
    getMock.mockResolvedValue(response);
    const replaceProductImagesMock = jest.fn<
      (productImages: unknown[]) => Promise<void>
    >();
    replaceProductImagesMock.mockResolvedValue(undefined);
    const syncApiRepository = {
      get: getMock,
    } as unknown as SyncApiRepository;
    const productImageSyncRepository = {
      replaceProductImages: replaceProductImagesMock,
    } as unknown as ProductImageSyncRepository;

    const service = new ProductImageSyncService(
      syncApiRepository,
      productImageSyncRepository,
    );

    return {
      service,
      syncApiRepository: syncApiRepository as {
        get: ReturnType<typeof jest.fn>;
      },
      productImageSyncRepository: productImageSyncRepository as unknown as {
        replaceProductImages: ReturnType<typeof jest.fn>;
      },
    };
  }

  it('throws the string message from failed responses', async () => {
    const {service, productImageSyncRepository} = createService({
      Mensagens: ['Erro x'],
      Resultado: [],
      Status: 0,
    });

    await expect(service.sync(user, organizationCode)).rejects.toThrow('Erro x');
    expect(productImageSyncRepository.replaceProductImages).not.toHaveBeenCalled();
  });

  it('throws the object message from failed responses', async () => {
    const {service, productImageSyncRepository} = createService({
      Mensagens: [{Conteudo: 'Erro x'}],
      Resultado: [],
      Status: 0,
    });

    await expect(service.sync(user, organizationCode)).rejects.toThrow('Erro x');
    expect(productImageSyncRepository.replaceProductImages).not.toHaveBeenCalled();
  });

  it('skips image sync and keeps local images for generic backend exceptions', async () => {
    AppStorageGateway.setSyncProductImagesEnabled.mockResolvedValue(undefined);
    const {service, productImageSyncRepository} = createService({
      mensagens: [
        {
          conteudo: 'Object reference not set to an instance of an object.',
        },
      ],
      resultado: null,
      status: 5,
    });

    await expect(service.sync(user, organizationCode)).resolves.toEqual({
      itemCount: 0,
      message: 'Servidor de imagens indisponível no momento. Mantendo imagens locais.',
      skipped: true,
    });
    expect(productImageSyncRepository.replaceProductImages).not.toHaveBeenCalled();
    expect(AppStorageGateway.setSyncProductImagesEnabled).toHaveBeenCalledWith(
      false,
    );
  });

  it('falls back to the default message when no usable message exists', async () => {
    const {service, productImageSyncRepository} = createService({
      Mensagens: [{Conteudo: '   '}, {}, null],
      Resultado: [],
      Status: 0,
    });

    await expect(service.sync(user, organizationCode)).rejects.toThrow(
      'Falha ao sincronizar imagens dos produtos.',
    );
    expect(productImageSyncRepository.replaceProductImages).not.toHaveBeenCalled();
  });

  it('stores images and disables image sync when the response is successful', async () => {
    AppStorageGateway.setSyncProductImagesEnabled.mockResolvedValue(undefined);
    const productImages = [
      {
        Codigo: 1,
        CodigoProduto: 10,
        Image: 'base64-image',
        IsDefault: true,
      },
    ];
    const {service, productImageSyncRepository} = createService(productImages);

    await expect(service.sync(user, organizationCode)).resolves.toEqual({
      itemCount: 1,
      message: 'Imagens dos produtos sincronizadas.',
    });

    expect(productImageSyncRepository.replaceProductImages).toHaveBeenCalledWith(
      productImages,
    );
    expect(AppStorageGateway.setSyncProductImagesEnabled).toHaveBeenCalledWith(
      false,
    );
  });
});
