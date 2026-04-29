export type SyncProductImageReference = {
  path: string;
  isDefault: boolean;
};

export type SyncApiProductDto = {
  Estoque: number;
  Codigo: number;
  Referencia: string | null;
  Descricao: string | null;
  UnidadeMedida: string | null;
  CodigoDeBarras: string | null;
  ValorVenda: number;
  VendeProdutoNoAtacado: boolean;
  ValorVendaAtacado: number;
  CodigoBarrasAtacado: string | null;
  UnidadeMedidaAtacado: string | null;
  PermiteFracionar: boolean;
  CodigoSetor: number;
  CodigoGrupo: number | null;
  CodigoSubGrupo: number | null;
  CodigoMarca: number | null;
};

export type ProdutoDto = {
  Estoque: number;
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
  images: SyncProductImageReference[];
};

export type ProdutoBodyCreateQtAndObsDto = {
  Codigo: number;
  Referencia: string;
  Descricao: string;
  UnidadeMedida: string;
  CodigoDeBarras: string;
  ValorVendaDesconto: number;
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
  Quantidade: number;
  Observacao: string;
};

export type SyncProductsApiResponse = {
  Resultado: SyncApiProductDto[];
  Status: number;
  Mensagens: string[];
};
