import {OpenUrlFirstTimeProps} from './type';
import {ApiClientService} from '@/services/api/services/api-client.service';

class ApiService {
  private readonly apiClientService = new ApiClientService();

  public async openLocalUrl<TResponse = unknown>(
    host: string,
  ): Promise<TResponse | undefined> {
    try {
      return (await this.apiClientService.validateConnection(host)) as
        | TResponse
        | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async openUrl<TResponse = unknown, TBody = unknown>(
    props: OpenUrlFirstTimeProps<TBody>,
  ): Promise<TResponse | undefined> {
    try {
      return await this.apiClientService.request<TResponse, TBody>({
        body: props.data,
        endpoint: props.endPoint ?? '',
        headers: props.headers,
        method: props.method,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async openUrlResult<TResponse = unknown, TBody = unknown>(
    props: OpenUrlFirstTimeProps<TBody>,
  ) {
    try {
      return await this.apiClientService.requestResponse<TResponse, TBody>({
        body: props.data,
        endpoint: props.endPoint ?? '',
        headers: props.headers,
        method: props.method,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async openUrlTimer<TResponse = unknown, TBody = unknown>(
    props: OpenUrlFirstTimeProps<TBody>,
  ): Promise<TResponse | undefined> {
    try {
      return await this.apiClientService.request<TResponse, TBody>({
        body: props.data,
        endpoint: props.endPoint ?? '',
        headers: props.headers,
        method: props.method,
        timeout: this.apiClientService.getShortTimeout(),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new ApiService();
