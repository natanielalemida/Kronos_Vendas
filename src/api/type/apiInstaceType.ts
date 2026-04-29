import {ApiHeaders, ApiMethod} from '@/services/api/types/api-client.types';

export type OpenUrlFirstTimeProps<TBody = unknown> = {
  endPoint?: string;
  method: ApiMethod;
  data?: TBody;
  headers?: ApiHeaders;
};
