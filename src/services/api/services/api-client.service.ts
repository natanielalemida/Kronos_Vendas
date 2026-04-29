import axios, {AxiosInstance, AxiosResponse} from 'axios';

import {checkInternetConnection} from '@/api/checkConnection';

import {ApiError} from '../errors/api.error';
import {
  ApiRequestConfig,
  ConnectionHealthResponse,
} from '../types/api-client.types';
import {ApiConfigService} from './api-config.service';

const DEFAULT_TIMEOUT = 800000;
const SHORT_TIMEOUT = 8000;

export class ApiClientService {
  private readonly apiConfigService = new ApiConfigService();

  private async createClient(
    host?: string,
    timeout = DEFAULT_TIMEOUT,
  ): Promise<AxiosInstance> {
    const isConnected = await checkInternetConnection();

    if (!isConnected) {
      throw new ApiError('Sem conexão com a internet');
    }

    if (!host) {
      throw new ApiError('Nenhuma conexão ativa configurada');
    }

    return axios.create({
      baseURL: `http://${host}/`,
      timeout,
    });
  }

  async request<TResponse, TBody = unknown>(
    config: ApiRequestConfig<TBody>,
  ): Promise<TResponse> {
    const resolvedConfig = await this.apiConfigService.resolve();
    const client = await this.createClient(
      config.host ?? resolvedConfig.host,
      config.timeout ?? DEFAULT_TIMEOUT,
    );

    const response = await client.request<TResponse>({
      data: config.body,
      headers: config.headers,
      method: config.method,
      url: config.endpoint,
    });

    return response.data;
  }

  async requestResponse<TResponse, TBody = unknown>(
    config: ApiRequestConfig<TBody>,
  ): Promise<AxiosResponse<TResponse>> {
    const resolvedConfig = await this.apiConfigService.resolve();
    const client = await this.createClient(
      config.host ?? resolvedConfig.host,
      config.timeout ?? DEFAULT_TIMEOUT,
    );

    return client.request<TResponse>({
      data: config.body,
      headers: config.headers,
      method: config.method,
      url: config.endpoint,
    });
  }

  async validateConnection(
    host: string,
  ): Promise<ConnectionHealthResponse | undefined> {
    const client = await this.createClient(host, SHORT_TIMEOUT);

    const response = await client.request<ConnectionHealthResponse>({
      method: 'get',
      url: 'arc/empresa/resumo',
    });

    return response.data;
  }

  getShortTimeout(): number {
    return SHORT_TIMEOUT;
  }
}
