import {knexConfig} from '@/database/connection';

import {
  ProductDetailsResult,
  ProductImageRow,
  ProductRow,
  ProductsSearchResult,
} from '../types/products-data.types';

export class ProductRepository {
  async searchProducts(textFilter?: string): Promise<ProductsSearchResult> {
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

  async getProductById(productCode: number): Promise<ProductDetailsResult> {
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
      Referencia: '',
      Descricao: product.Descricao,
      DescricaoComplementar: product.DescricaoComplementar ?? null,
      ValorVenda: product.ValorVenda,
      VendeProdutoNoAtacado: product.VendeProdutoNoAtacado === true,
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
      images: images.map(image => ({
        path: image.Image,
        isDefault: image.IsDefault === 1,
      })),
    };
  }
}
