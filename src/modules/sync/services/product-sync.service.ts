import {UserDto} from '@/shared/types';

import {ProductSyncRepository} from '../repositories/product-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {ProdutoDto, SyncProductsApiResponse} from '../types/product-sync.types';
import {SyncStepRunResult} from '../types/sync-run.types';

type ProductRow = Omit<ProdutoDto, 'images'>;

function mapProductRow(product: ProdutoDto): ProductRow {
  return {
    Estoque: product.Estoque,
    Codigo: product.Codigo,
    Referencia: product.Referencia,
    Descricao: product.Descricao,
    UnidadeMedida: product.UnidadeMedida,
    CodigoDeBarras: product.CodigoDeBarras,
    ValorVenda: product.ValorVenda,
    VendeProdutoNoAtacado: product.VendeProdutoNoAtacado,
    ValorVendaAtacado: product.ValorVendaAtacado,
    CodigoBarrasAtacado: product.CodigoBarrasAtacado,
    UnidadeMedidaAtacado: product.UnidadeMedidaAtacado,
    PermiteFracionar: product.PermiteFracionar,
    CodigoSetor: product.CodigoSetor,
    CodigoGrupo: product.CodigoGrupo,
    CodigoSubGrupo: product.CodigoSubGrupo,
    CodigoMarca: product.CodigoMarca,
  };
}

export class ProductSyncService {
  constructor(
    private readonly syncApiRepository: SyncApiRepository,
    private readonly productSyncRepository: ProductSyncRepository,
  ) {}

  async sync(
    user: UserDto,
    organizationCode: number,
  ): Promise<SyncStepRunResult> {
    const response = await this.syncApiRepository.get<SyncProductsApiResponse>(
      'arc/produto/vendas/mobile',
      user,
      organizationCode,
    );

    if (response.Status !== 1) {
      throw new Error('Failed to synchronize products.');
    }

    await this.productSyncRepository.replaceProducts(
      response.Resultado.map(mapProductRow),
    );

    return {
      itemCount: response.Resultado.length,
      message: 'Products synchronized.',
    };
  }
}
