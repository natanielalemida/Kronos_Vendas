export type SyncProductImageDto = {
  CodigoProduto: number;
  Image: string;
  IsDefault: boolean;
};

export type SyncProductImagesApiResponse = {
  Resultado: SyncProductImageDto[];
  Status: number;
  Mensagens: string[];
};
