import {create} from 'zustand';

import {CustomerListItem} from '../types/customer-list.types';

type CustomersPageStore = {
  isModalVisible: boolean;
  searchText: string;
  selectedCustomer?: CustomerListItem;
  setModalVisible: (value: boolean) => void;
  setSearchText: (value: string) => void;
  setSelectedCustomer: (value: CustomerListItem | undefined) => void;
};

export const useCustomersPageStore = create<CustomersPageStore>(set => ({
  isModalVisible: false,
  searchText: '',
  selectedCustomer: undefined,
  setModalVisible: value => set({isModalVisible: value}),
  setSearchText: value => set({searchText: value}),
  setSelectedCustomer: value => set({selectedCustomer: value}),
}));
