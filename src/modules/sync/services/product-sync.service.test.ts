import {beforeEach, describe, expect, it, jest} from '@jest/globals';
import {UserDto} from '@/shared/types';

import {ProductSyncRepository} from '../repositories/product-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {ProductSyncService} from './product-sync.service';

describe('ProductSyncService', () => {
  const user = {Hash: 'hash'} as UserDto;
  const organizationCode = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createService(response: unknown) {
    const syncApiRepository = {
      get: jest.fn().mockResolvedValue(response),
    } as unknown as SyncApiRepository;
    const productSyncRepository = {
      replaceProducts: jest.fn().mockResolvedValue(undefined),
    } as unknown as ProductSyncRepository;

    return {
      service: new ProductSyncService(syncApiRepository, productSyncRepository),
      syncApiRepository: syncApiRepository as {get: ReturnType<typeof jest.fn>},
      productSyncRepository: productSyncRepository as {
        replaceProducts: ReturnType<typeof jest.fn>;
      },
    };
  }

  it('requests products from the sales mobile endpoint and stores normalized rows', async () => {
    const apiProduct = {
      Estoque: 10,
      Codigo: 1,
      Referencia: ' REF-1 ',
      Descricao: ' Produto 1 ',
      UnidadeMedida: ' UN ',
      CodigoDeBarras: ' 123 ',
      ValorVenda: 12.5,
      VendeProdutoNoAtacado: true,
      ValorVendaAtacado: 10,
      CodigoBarrasAtacado: ' 321 ',
      UnidadeMedidaAtacado: ' CX ',
      PermiteFracionar: false,
      CodigoSetor: 2,
      CodigoGrupo: null,
      CodigoSubGrupo: 3,
      CodigoMarca: 4,
    };
    const {service, syncApiRepository, productSyncRepository} = createService({
      Resultado: [apiProduct],
      Status: 1,
      Mensagens: [],
    });

    await expect(service.sync(user, organizationCode)).resolves.toEqual({
      itemCount: 1,
      message: 'Produtos sincronizados.',
    });

    expect(syncApiRepository.get).toHaveBeenCalledWith(
      'arc/produto/vendas/mobile',
      user,
      organizationCode,
    );
    expect(productSyncRepository.replaceProducts).toHaveBeenCalledWith([
      {
        ...apiProduct,
        Referencia: 'REF-1',
        Descricao: 'Produto 1',
        UnidadeMedida: 'UN',
        CodigoDeBarras: '123',
        CodigoBarrasAtacado: '321',
        UnidadeMedidaAtacado: 'CX',
        CodigoGrupo: 0,
      },
    ]);
  });

  it('throws when the products endpoint returns a failed status', async () => {
    const {service, productSyncRepository} = createService({
      Resultado: [],
      Status: 0,
      Mensagens: ['Erro'],
    });

    await expect(service.sync(user, organizationCode)).rejects.toThrow(
      'Falha ao sincronizar produtos.',
    );
    expect(productSyncRepository.replaceProducts).not.toHaveBeenCalled();
  });
});
