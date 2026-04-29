import {ApiClientService} from '@/services/api/services/api-client.service';

export class ConnectionValidationService {
  private readonly apiClientService = new ApiClientService();

  async validate(host: string): Promise<boolean> {
    const result = await this.apiClientService.validateConnection(host);
    return !!result;
  }
}
