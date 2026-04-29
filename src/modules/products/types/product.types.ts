import {SyncProductImageReference} from '@/modules/sync/types/product-sync.types';

export type ProductListItem = {
  Codigo: number;
  Referencia: string;
  Descricao: string;
  UnidadeMedida: string;
  CodigoDeBarras: string;
  ValorVenda: number;
  VendeProdutoNoAtacado: boolean;
  ValorVendaAtacado: number;
  CodigoBarrasAtacado: string;
  UnidadeMedidaAtacado: string;
  PermiteFracionar: boolean;
  CodigoSetor: number;
  CodigoGrupo: number;
  CodigoSubGrupo: number | null;
  CodigoMarca: number | null;
  Estoque: number;
  images: SyncProductImageReference[];
};

export type ProductDetails = ProductListItem & {
  DescricaoComplementar?: string | null;
};
