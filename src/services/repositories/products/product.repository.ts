import {knexConfig} from '@/database/connection';
import {ProdutoDto} from '@/modules/sync/types/product-sync.types';

type ProductImageRow = {
  CodigoProduto: number;
  Image: string;
  IsDefault: number;
};

type ProductRow = {
  Codigo: number;
  Descricao: string;
  ValorVenda: number;
  CodigoDeBarras: string;
  UnidadeMedida: string;
  ValorVendaAtacado: number;
  VendeProdutoNoAtacado: boolean;
  Estoque?: number;
};

export default class ProductRepository {
  async getProducts(
    textFilter?: string,
  ): Promise<{data: ProdutoDto[]; total: number}> {
    const productsQuery = knexConfig('produtos')
      .select('produtos.*')
      .limit(50)
      .orderBy('produtos.Descricao');

    if (textFilter && textFilter.length > 0) {
      productsQuery.andWhereRaw('LOWER(produtos.Descricao) LIKE ?', [
        `%${textFilter.toLowerCase()}%`,
      ]);
    }

    const products = (await productsQuery) as ProductRow[];
    const productImages = (await knexConfig('produto_imagem')
      .select('*')
      .whereIn(
        'CodigoProduto',
        products.map(product => product.Codigo),
      )) as ProductImageRow[];

    const result = products.map(product => ({
      Codigo: product.Codigo,
      Referencia: '',
      CodigoProduto: product.Codigo,
      Descricao: product.Descricao,
      ValorVenda: product.ValorVenda,
      VendeProdutoNoAtacado: product.VendeProdutoNoAtacado,
      CodigoDeBarras: product.CodigoDeBarras,
      UnidadeMedida: product.UnidadeMedida,
      ValorVendaAtacado: product.ValorVendaAtacado,
      Estoque: product.Estoque ?? 0,
      CodigoBarrasAtacado: '',
      UnidadeMedidaAtacado: '',
      PermiteFracionar: false,
      CodigoSetor: 0,
      CodigoGrupo: 0,
      CodigoSubGrupo: null,
      CodigoMarca: null,
      images: productImages
        .filter(image => image.CodigoProduto === product.Codigo)
        .map(image => ({
          path: image.Image,
          isDefault: image.IsDefault === 1,
        })),
    }));

    return {
      data: result,
      total: result.length,
    };
  }

  async getById(productCode: string): Promise<ProdutoDto | null> {
    const product = (await knexConfig('produtos')
      .select('*')
      .where('Codigo', productCode)
      .first()) as ProductRow | undefined;

    if (!product) {
      return null;
    }

    const images = (await knexConfig('produto_imagem')
      .select('*')
      .where('CodigoProduto', productCode)) as ProductImageRow[];

    return {
      Codigo: product.Codigo,
      Descricao: product.Descricao,
      ValorVenda: product.ValorVenda,
      CodigoDeBarras: product.CodigoDeBarras,
      UnidadeMedida: product.UnidadeMedida,
      ValorVendaAtacado: product.ValorVendaAtacado,
      VendeProdutoNoAtacado: product.VendeProdutoNoAtacado === true,
      Estoque: product.Estoque ?? 0,
      images: images.map(image => ({
        path: image.Image,
        isDefault: image.IsDefault === 1,
      })),
      Referencia: '',
      CodigoBarrasAtacado: '',
      UnidadeMedidaAtacado: '',
      PermiteFracionar: false,
      CodigoSetor: 0,
      CodigoGrupo: 0,
      CodigoSubGrupo: null,
      CodigoMarca: null,
    };
  }
}
