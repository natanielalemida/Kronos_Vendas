import {useQuery} from '@tanstack/react-query';

import {CustomerRepository} from '@/services/repositories/customers/customer.repository';

import {customersQueryKeys} from '../query-keys/customers.query-keys';
import {customersFilterSchema} from '../schemas/customers-filter.schema';
import {CustomerListItem} from '../types/customer-list.types';

const repository = new CustomerRepository();

export function useCustomersQuery(searchText: string) {
  const parsedFilter = customersFilterSchema.parse({searchText});

  return useQuery<CustomerListItem[], Error>({
    queryFn: async (): Promise<CustomerListItem[]> => {
      const response = await repository.search(parsedFilter.searchText);
      return response.data as CustomerListItem[];
    },
    queryKey: customersQueryKeys.list(parsedFilter.searchText),
    staleTime: 1000 * 30,
  });
}
