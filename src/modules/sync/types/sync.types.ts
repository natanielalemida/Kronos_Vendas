export type SyncProgress = {
  message: string;
  progress: number;
};

export type SyncMessageObject = {
  Conteudo?: string | null;
  conteudo?: string | null;
};

export type SyncMessageEntry = string | SyncMessageObject | null | undefined;

export type SyncMessageCollection = SyncMessageEntry[] | null | undefined;
