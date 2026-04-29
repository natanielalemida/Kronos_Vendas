export type ApiMethod = 'get' | 'post' | 'put' | 'delete';

export type ApiHeaders = Record<string, string | number | boolean>;

export type ApiRequestConfig<TBody = unknown> = {
  endpoint: string;
  method: ApiMethod;
  body?: TBody;
  headers?: ApiHeaders;
  timeout?: number;
  host?: string;
};

export type ConnectionHealthResponse = {
  Resultado?: unknown;
  Status?: number;
  Mensagens?: unknown[];
};
