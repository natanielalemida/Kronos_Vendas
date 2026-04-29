import {CustomerListItem} from './customer-list.types';

export type UseSetupCustomersPageResult = {
  data: {
    customers: CustomerListItem[];
    isLoading: boolean;
    searchText: string;
    selectedCustomer?: CustomerListItem;
  };
  handlers: {
    handleCloseModal: () => Promise<void>;
    handleModalVisibilityChange: (value: boolean) => void;
    handleOpenCustomerActions: (customer: CustomerListItem) => void;
    handleSearchTextChange: (value: string) => void;
  };
  viewState: {
    isModalVisible: boolean;
    shouldShowEmptyState: boolean;
  };
};
