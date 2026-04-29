export type SyncProductImageReference = {
  path: string;
  isDefault: boolean;
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
  Resultado: ProdutoDto[];
  Status: number;
  Mensagens: string[];
};
