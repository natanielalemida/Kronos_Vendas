import {UserDto} from '@/shared/types';

import {CustomerSyncRepository} from '../repositories/customer-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {SyncCustomersApiResponse} from '../types/customer-sync.types';
import {SyncStepRunResult} from '../types/sync-run.types';

export class CustomerSyncService {
  constructor(
    private readonly syncApiRepository: SyncApiRepository,
    private readonly customerSyncRepository: CustomerSyncRepository,
  ) {}

  async sync(
    user: UserDto,
    organizationCode: number,
  ): Promise<SyncStepRunResult> {
    const response = await this.syncApiRepository.get<SyncCustomersApiResponse>(
      'arc/cliente/vendas/mobile?CodigoRegiao=null;CodigoCategoria=null',
      user,
      organizationCode,
    );

    if (response.Status !== 1) {
      throw new Error('Failed to synchronize customers.');
    }

    await this.customerSyncRepository.replaceCustomers(response.Resultado);

    return {
      itemCount: response.Resultado.length,
      message: 'Customers synchronized.',
    };
  }
}
