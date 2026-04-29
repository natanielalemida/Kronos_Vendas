import ApiInstace from '@/api/ApiInstace';
import {UserDto} from '@/shared/types';

import {CustomerUploadRepository} from '../repositories/customer-upload.repository';
import {UploadCustomersResult} from '../types/customer-upload.types';
import {
  customerUploadApiResponseSchema,
  customerUploadPayloadSchema,
} from '../schemas/customer-upload.schema';
import {syncExecutionContextSchema} from '../schemas/sync.schema';

export class CustomerUploadService {
  constructor(
    private readonly customerUploadRepository: CustomerUploadRepository,
  ) {}

  async uploadPendingCustomers(
    user: UserDto,
    organizationCode: number,
  ): Promise<UploadCustomersResult> {
    syncExecutionContextSchema.parse({
      organizationCode,
      userHash: user.Hash,
    });

    const customers = await this.customerUploadRepository.getPendingCustomers(
      user,
    );

    if (customers.length === 0) {
      return {
        uploadedCustomersCount: 0,
      };
    }

    for (const customer of customers) {
      const payload = customerUploadPayloadSchema.parse(customer);
      const response = await ApiInstace.openUrl({
        method: 'post',
        data: payload,
        headers: {
          Empresa: organizationCode,
          Auth: user.Hash,
        },
        endPoint: 'arc/cliente',
      });

      customerUploadApiResponseSchema.parse(response);
    }

    return {
      uploadedCustomersCount: customers.length,
    };
  }
}
