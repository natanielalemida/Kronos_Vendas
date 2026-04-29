import {UserDto} from '@/shared/types';

import {PaymentMethodSyncRepository} from '../repositories/payment-method-sync.repository';
import {SyncApiRepository} from '../repositories/sync-api.repository';
import {SyncPaymentMethodsApiResponse} from '../types/payment-method-sync.types';
import {SyncStepRunResult} from '../types/sync-run.types';

export class PaymentMethodSyncService {
  constructor(
    private readonly syncApiRepository: SyncApiRepository,
    private readonly paymentMethodSyncRepository: PaymentMethodSyncRepository,
  ) {}

  async sync(
    user: UserDto,
    organizationCode: number,
  ): Promise<SyncStepRunResult> {
    const response =
      await this.syncApiRepository.get<SyncPaymentMethodsApiResponse>(
        'arc/formapagamento',
        user,
        organizationCode,
      );

    if (response.Status !== 1) {
      throw new Error('Failed to synchronize payment methods.');
    }

    await this.paymentMethodSyncRepository.replacePaymentMethods(
      response.Resultado,
    );

    return {
      itemCount: response.Resultado.length,
      message: 'Payment methods synchronized.',
    };
  }
}
