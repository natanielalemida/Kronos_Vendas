import {useNavigation, useRoute} from '@react-navigation/native';

import {ORDER_STATUS_LABELS} from '../constants/orders.constants';
import {useOrdersFilters} from './useOrdersFilters';
import {useOrdersHandlers} from './useOrdersHandlers';
import {useOrdersQuery} from '../queries/orders.query';
import {ordersRouteParamsSchema} from '../schemas/orders-filter.schema';
import {useOrdersPageStore} from '../stores/useOrdersPageStore';
import {OrdersPageNavigation} from '../types/orders-navigation.types';
import {
  OrdersPageRouteParams,
  UseSetupOrdersPageResult,
} from '../types/orders-page.types';
import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useAppSession} from '@/shared/hooks/useAppSession';
import {mapEditableCustomerRecordToClienteDto} from '@/modules/customers/helpers/customer-sync.helpers';
import {CustomerEditRepository} from '@/modules/customers/repositories/customer-edit.repository';
import {useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {useSendOrdersMutation} from '../mutations/send-orders.mutation';

export function useSetupOrdersPage(): UseSetupOrdersPageResult {
  const route = useRoute();
  const navigation = useNavigation() as OrdersPageNavigation;
  const {params} = route as {params?: OrdersPageRouteParams};
  const parsedParams = ordersRouteParamsSchema.safeParse(params ?? {});
  const customerId = parsedParams.success
    ? parsedParams.data.clienteId
    : undefined;
  const customerRepositoryRef = useRef(new CustomerEditRepository());
  const filterIconRef = useRef<TouchableOpacity | null>(null);
  const {usuario, empresa} = useAppSession();
  const {terminal} = useAppStorage();
  const company = empresa as {Codigo?: number} | undefined;
  const filterModalPosition = useOrdersPageStore(
    state => state.filterModalPosition,
  );
  const isFilterModalVisible = useOrdersPageStore(
    state => state.isFilterModalVisible,
  );
  const options = useOrdersPageStore(state => state.options);
  const selectedOrders = useOrdersPageStore(state => state.selectedOrders);
  const textFilter = useOrdersPageStore(state => state.textFilter);
  const setFilterModalPosition = useOrdersPageStore(
    state => state.setFilterModalPosition,
  );
  const setFilterModalVisible = useOrdersPageStore(
    state => state.setFilterModalVisible,
  );
  const setOptions = useOrdersPageStore(state => state.setOptions);
  const setSelectedOrders = useOrdersPageStore(
    state => state.setSelectedOrders,
  );
  const setTextFilter = useOrdersPageStore(state => state.setTextFilter);

  useEffect(() => {
    if (options.clienteId === customerId) {
      return;
    }

    setOptions(currentValue => ({...currentValue, clienteId: customerId}));
  }, [customerId, options.clienteId, setOptions]);

  const query = useOrdersQuery(options);
  const sendOrdersMutation = useSendOrdersMutation();

  const {filteredOrders} = useOrdersFilters({
    orders: query.data ?? [],
    textFilter,
  });

  const handlers = useOrdersHandlers({
    company,
    filterIconRef,
    getByIdToSave: async customerId =>
      mapEditableCustomerRecordToClienteDto(
        await customerRepositoryRef.current.findById(customerId),
      ),
    navigation,
    selectedOrders,
    setFilterModalPosition,
    setIsFilterModalVisible: setFilterModalVisible,
    setLoading: () => undefined,
    setOptions,
    setSelectedOrders,
    setTextFilter,
    sendOrder: async paramsToSend => {
      const result = await sendOrdersMutation.mutateAsync([paramsToSend]);
      return result[0];
    },
    terminal,
    usuario,
  });

  return {
    data: {
      filterIconRef,
      filterModalPosition,
      filteredOrders,
      isLoading:
        query.isLoading || query.isFetching || sendOrdersMutation.isPending,
      options,
      selectedOrders,
      statusLabels: ORDER_STATUS_LABELS,
      textFilter,
    },
    derivedState: {
      hasCustomerContext: !!customerId,
    },
    handlers,
    navigation: {
      goBack: () => navigation.goBack(),
      toggleDrawer: () => navigation.toggleDrawer?.(),
    },
    viewState: {
      isFilterModalVisible,
    },
  };
}
