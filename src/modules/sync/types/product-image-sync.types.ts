import {SyncMessageCollection} from './sync.types';

export type SyncProductImageDto = {
  Codigo?: number | null;
  CodigoProduto: number;
  Image: string;
  IsDefault: boolean | null;
};

export type SyncProductImagesApiResponse = {
  Resultado?: SyncProductImageDto[] | null;
  resultado?: SyncProductImageDto[] | null;
  Status: number;
  status?: number;
  Mensagens?: SyncMessageCollection;
  mensagens?: SyncMessageCollection;
};
