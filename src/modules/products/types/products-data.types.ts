import {ProductDetails, ProductListItem} from './product.types';

export type ProductImageRow = {
  CodigoProduto: number;
  Image: string;
  IsDefault: number;
};

export type ProductRow = {
  Codigo: number;
  Descricao: string;
  DescricaoComplementar?: string | null;
  ValorVenda: number;
  CodigoDeBarras: string;
  UnidadeMedida: string;
  ValorVendaAtacado: number;
  VendeProdutoNoAtacado: boolean;
  Estoque?: number;
};

export type ProductsSearchResult = {
  data: ProductListItem[];
  total: number;
};

export type ProductDetailsResult = ProductDetails | null;
