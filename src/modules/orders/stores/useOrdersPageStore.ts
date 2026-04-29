import {create} from 'zustand';

import {DEFAULT_ORDERS_FILTER_OPTIONS} from '../constants/orders.constants';
import {OrderListItem, OrdersFilterOptions} from '../types/order.types';
import {OrdersFilterModalPosition} from '../types/orders-page.types';

type OrdersPageStore = {
  filterModalPosition: OrdersFilterModalPosition;
  isFilterModalVisible: boolean;
  options: OrdersFilterOptions;
  selectedOrders: OrderListItem[];
  textFilter: string;
  setFilterModalPosition: (value: OrdersFilterModalPosition) => void;
  setFilterModalVisible: (value: boolean) => void;
  setOptions: (
    value:
      | OrdersFilterOptions
      | ((currentValue: OrdersFilterOptions) => OrdersFilterOptions),
  ) => void;
  setSelectedOrders: (
    value:
      | OrderListItem[]
      | ((currentValue: OrderListItem[]) => OrderListItem[]),
  ) => void;
  setTextFilter: (value: string) => void;
};

export const useOrdersPageStore = create<OrdersPageStore>(set => ({
  filterModalPosition: {x: 0, y: 0},
  isFilterModalVisible: false,
  options: DEFAULT_ORDERS_FILTER_OPTIONS,
  selectedOrders: [],
  textFilter: '',
  setFilterModalPosition: value => set({filterModalPosition: value}),
  setFilterModalVisible: value => set({isFilterModalVisible: value}),
  setOptions: value =>
    set(state => ({
      options: typeof value === 'function' ? value(state.options) : value,
    })),
  setSelectedOrders: value =>
    set(state => ({
      selectedOrders:
        typeof value === 'function' ? value(state.selectedOrders) : value,
    })),
  setTextFilter: value => set({textFilter: value}),
}));
