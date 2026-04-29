import {useCustomersPageHandlers} from './useCustomersPageHandlers';
import {useDebouncedSearchText} from './useDebouncedSearchText';
import {useCustomersQuery} from '../queries/customers.query';
import {useCustomersPageStore} from '../stores/useCustomersPageStore';
import {UseSetupCustomersPageResult} from '../types/customers-page.types';
import {useQueryClient} from '@tanstack/react-query';
import {customersQueryKeys} from '../query-keys/customers.query-keys';

export function useSetupCustomersPage(): UseSetupCustomersPageResult {
  const queryClient = useQueryClient();
  const isModalVisible = useCustomersPageStore(state => state.isModalVisible);
  const searchText = useCustomersPageStore(state => state.searchText);
  const selectedCustomer = useCustomersPageStore(
    state => state.selectedCustomer,
  );
  const setModalVisible = useCustomersPageStore(state => state.setModalVisible);
  const setSearchText = useCustomersPageStore(state => state.setSearchText);
  const setSelectedCustomer = useCustomersPageStore(
    state => state.setSelectedCustomer,
  );
  const debouncedSearchText = useDebouncedSearchText(searchText);
  const query = useCustomersQuery(debouncedSearchText);

  const handlers = useCustomersPageHandlers({
    fetchCustomers: async () => {
      await queryClient.invalidateQueries({queryKey: customersQueryKeys.all});
    },
    handleVerifyCliente: customer => {
      setSelectedCustomer(customer);
      setModalVisible(true);
    },
    setActive: setModalVisible,
    setSearchText,
  });

  return {
    data: {
      customers: query.data ?? [],
      isLoading: query.isLoading || query.isFetching,
      searchText,
      selectedCustomer,
    },
    handlers,
    viewState: {
      isModalVisible,
      shouldShowEmptyState: (query.data?.length ?? 0) === 0 && !query.isLoading,
    },
  };
}
