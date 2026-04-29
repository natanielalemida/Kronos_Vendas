import {UserDto} from '@/shared/types';

import {PendingCustomerPayload} from '../types/customer-upload.types';
import {SingleCustomerUploadRepository} from './single-customer-upload.repository';

export class CustomerUploadRepository {
  private readonly customerRepository = new SingleCustomerUploadRepository();

  async getPendingCustomers(user: UserDto): Promise<PendingCustomerPayload[]> {
    return this.customerRepository.getPendingCustomers(user);
  }
}
