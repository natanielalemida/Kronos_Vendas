import {Dispatch, MutableRefObject, SetStateAction} from 'react';

import {ClienteDto} from '@/modules/sync/types/customer-sync.types';
import {UserDto} from '@/shared/types';

import {OrderControllerSendParams} from './orders-data.types';
import {OrdersPageNavigation} from './orders-navigation.types';
import {OrderListItem, OrdersFilterOptions} from './order.types';
import {OrdersFilterModalPosition} from './orders-page.types';

export type MeasureTarget = {
  measure: (
    callback: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number,
    ) => void,
  ) => void;
};

export type UseOrdersEffectsParams = {
  customerId?: number;
  getOrders: (options: OrdersFilterOptions) => Promise<OrderListItem[]>;
  navigation: OrdersPageNavigation;
  options: OrdersFilterOptions;
  setOptions: Dispatch<SetStateAction<OrdersFilterOptions>>;
  setOrders: Dispatch<SetStateAction<OrderListItem[]>>;
  setSelectedOrders: Dispatch<SetStateAction<OrderListItem[]>>;
};

export type UseOrdersHandlersParams = {
  company?: {Codigo?: number};
  filterIconRef: MutableRefObject<MeasureTarget | null>;
  getByIdToSave: (customerId: number) => Promise<ClienteDto>;
  navigation: OrdersPageNavigation;
  sendOrder: (
    params: OrderControllerSendParams,
  ) => Promise<boolean | undefined>;
  selectedOrders: OrderListItem[];
  setFilterModalPosition: (position: OrdersFilterModalPosition) => void;
  setIsFilterModalVisible: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setOptions: Dispatch<SetStateAction<OrdersFilterOptions>>;
  setSelectedOrders: Dispatch<SetStateAction<OrderListItem[]>>;
  setTextFilter: (value: string) => void;
  terminal?: number | null;
  usuario?: UserDto;
};
