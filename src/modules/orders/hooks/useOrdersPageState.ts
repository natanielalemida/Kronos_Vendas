import {useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';
import {useAppSession} from '@/shared/hooks/useAppSession';
import {CustomerEditRepository} from '@/modules/customers/repositories/customer-edit.repository';

import {OrderController} from '../controllers/order.controller';
import {DEFAULT_ORDERS_FILTER_OPTIONS} from '../constants/orders.constants';
import {OrderListItem} from '../types/order.types';

export function useOrdersPageState() {
  const orderControllerRef = useRef(new OrderController());
  const customerRepositoryRef = useRef(new CustomerEditRepository());
  const {usuario, empresa} = useAppSession();
  const {terminal} = useAppStorage();
  const company = empresa as {Codigo?: number} | undefined;

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [options, setOptions] = useState(DEFAULT_ORDERS_FILTER_OPTIONS);
  const [textFilter, setTextFilter] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filterModalPosition, setFilterModalPosition] = useState({x: 0, y: 0});
  const [selectedOrders, setSelectedOrders] = useState<OrderListItem[]>([]);
  const filterIconRef = useRef<TouchableOpacity | null>(null);

  return {
    filters: {
      options,
      setOptions,
      textFilter,
      setTextFilter,
    },
    modal: {
      filterIconRef,
      filterModalPosition,
      isFilterModalVisible,
      setFilterModalPosition,
      setIsFilterModalVisible,
    },
    orders: {
      getOrders: orderControllerRef.current.fetchOrders.bind(
        orderControllerRef.current,
      ),
      isLoading,
      orders,
      selectedOrders,
      sendOrder: orderControllerRef.current.sendOrder.bind(
        orderControllerRef.current,
      ),
      setOrders,
      setSelectedOrders,
      setLoading,
    },
    session: {
      company,
      getByIdToSave: customerRepositoryRef.current.findById.bind(
        customerRepositoryRef.current,
      ),
      terminal,
      usuario,
    },
  };
}
