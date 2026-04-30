import {useCustomersPageHandlers} from './useCustomersPageHandlers';
import {useDebouncedSearchText} from './useDebouncedSearchText';
import {useCustomersQuery} from '../queries/customers.query';
import {useCustomersPageStore} from '../stores/useCustomersPageStore';
import {UseSetupCustomersPageResult} from '../types/customers-page.types';

export function useSetupCustomersPage(): UseSetupCustomersPageResult {
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
