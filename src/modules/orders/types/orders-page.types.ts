import {Dispatch, MutableRefObject, SetStateAction} from 'react';
import {TouchableOpacity} from 'react-native';

import {OrderListItem, OrdersFilterOptions} from './order.types';

export type OrdersPageRouteParams = {
  clienteId?: number;
};

export type OrdersFilterModalPosition = {
  x: number;
  y: number;
};

export type UseSetupOrdersPageResult = {
  data: {
    filterIconRef: MutableRefObject<TouchableOpacity | null>;
    filterModalPosition: OrdersFilterModalPosition;
    filteredOrders: OrderListItem[];
    isLoading: boolean;
    options: OrdersFilterOptions;
    selectedOrders: OrderListItem[];
    statusLabels: Record<number, {label: string; color: string}>;
    textFilter: string;
  };
  derivedState: {
    hasCustomerContext: boolean;
  };
  handlers: {
    handleCloseFilterModal: () => void;
    handleOpenFilterModal: () => void;
    handleOrderPress: (order: OrderListItem) => void;
    handleSelectOrder: (order: OrderListItem) => void;
    handleSendOrders: () => Promise<void>;
    handleTextFilterChange: (value: string) => void;
    setOptions: Dispatch<SetStateAction<OrdersFilterOptions>>;
  };
  navigation: {
    goBack: () => void;
    toggleDrawer: () => void;
  };
  viewState: {
    isFilterModalVisible: boolean;
  };
};
