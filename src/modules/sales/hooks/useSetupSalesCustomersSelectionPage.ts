import {useNavigation} from '@react-navigation/native';

import {useDebouncedSearchText} from '@/modules/customers/hooks/useDebouncedSearchText';
import {useCustomersQuery} from '@/modules/customers/queries/customers.query';
import {CustomerListItem} from '@/modules/customers/types/customer-list.types';
import {useAppSession} from '@/shared/hooks/useAppSession';

import {mapCustomerListItemToClienteDto} from '../helpers/sales-selection.helpers';
import {salesSearchSchema} from '../schemas/sales.schema';
import {SalesPageNavigation} from '../types/sales-navigation.types';
import {UseSetupSalesCustomersSelectionPageResult} from '../types/sales-selection.types';
import {useState} from 'react';

export function useSetupSalesCustomersSelectionPage(): UseSetupSalesCustomersSelectionPageResult {
  const navigation = useNavigation() as SalesPageNavigation;
  const {setClienteOnContext} = useAppSession();
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebouncedSearchText(searchText);
  const query = useCustomersQuery(debouncedSearchText);

  const handleSelectCustomer = (customer: CustomerListItem) => {
    setClienteOnContext(mapCustomerListItemToClienteDto(customer));
    setSearchText('');
    navigation.goBack();
  };

  const handleSearchTextChange = (value: string) => {
    setSearchText(salesSearchSchema.parse({searchText: value}).searchText);
  };

  return {
    data: {
      customers: query.data ?? [],
      isLoading: query.isLoading || query.isFetching,
      searchText,
    },
    handlers: {
      handleSearchTextChange,
      handleSelectCustomer,
    },
    viewState: {
      shouldShowEmptyState: (query.data?.length ?? 0) === 0 && !query.isLoading,
    },
  };
}
