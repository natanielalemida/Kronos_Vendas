import ApiInstace from '@/api/ApiInstace';
import {UserDto} from '@/shared/types';

export class SyncApiRepository {
  async get<TResponse>(
    endpoint: string,
    user: Pick<UserDto, 'Hash'>,
    organizationCode: number,
  ): Promise<TResponse> {
    return ApiInstace.openUrl({
      data: undefined,
      method: 'get',
      endPoint: endpoint,
      headers: {
        Auth: user.Hash,
        Empresa: organizationCode,
      },
    }) as Promise<TResponse>;
  }
}
