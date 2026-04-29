import {MutableRefObject} from 'react';

import {CustomerListItem} from './customer-list.types';

export type FetchCustomers = (textFilter?: string) => Promise<void>;

export type UseCustomersPageEffectsParams = {
  debounceRef: MutableRefObject<NodeJS.Timeout | null>;
  fetchCustomers: FetchCustomers;
  searchText: string;
};

export type UseCustomersPageHandlersParams = {
  fetchCustomers: FetchCustomers;
  handleVerifyCliente: (customer: CustomerListItem) => void;
  setActive: (value: boolean) => void;
  setSearchText: (value: string) => void;
};
