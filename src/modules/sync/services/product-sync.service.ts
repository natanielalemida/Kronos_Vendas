import {UserDto} from '@/shared/types';

import {ProductSyncRepository} from '../repositories/product-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {syncProductsApiResponseSchema} from '../schemas/sync.schema';
import {
  ProdutoDto,
  SyncApiProductDto,
  SyncProductsApiResponse,
} from '../types/product-sync.types';
import {SyncStepRunResult} from '../types/sync-run.types';

type ProductRow = Omit<ProdutoDto, 'images'>;

function normalizeProductText(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

function mapProductRow(product: SyncApiProductDto): ProductRow {
  return {
    Estoque: product.Estoque,
    Codigo: product.Codigo,
    Referencia: normalizeProductText(product.Referencia),
    Descricao: normalizeProductText(product.Descricao),
    UnidadeMedida: normalizeProductText(product.UnidadeMedida),
    CodigoDeBarras: normalizeProductText(product.CodigoDeBarras),
    ValorVenda: product.ValorVenda,
    VendeProdutoNoAtacado: product.VendeProdutoNoAtacado,
    ValorVendaAtacado: product.ValorVendaAtacado,
    CodigoBarrasAtacado: normalizeProductText(product.CodigoBarrasAtacado),
    UnidadeMedidaAtacado: normalizeProductText(product.UnidadeMedidaAtacado),
    PermiteFracionar: product.PermiteFracionar,
    CodigoSetor: product.CodigoSetor,
    CodigoGrupo: product.CodigoGrupo ?? 0,
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
    const parsedResponse = syncProductsApiResponseSchema.parse(response);

    if (parsedResponse.Status !== 1) {
      throw new Error('Falha ao sincronizar produtos.');
    }

    await this.productSyncRepository.replaceProducts(
      parsedResponse.Resultado.map(mapProductRow),
    );

    return {
      itemCount: parsedResponse.Resultado.length,
      message: 'Produtos sincronizados.',
    };
  }
}
