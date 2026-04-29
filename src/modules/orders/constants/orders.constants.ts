import {OrdersFilterOptions} from '../types/order.types';

export const DEFAULT_ORDERS_FILTER_OPTIONS: OrdersFilterOptions = {
  syncds: true,
  notSyncd: true,
};

export const ORDER_STATUS_LABELS = {
  0: {label: 'Pendente', color: '#f1c40f'},
  1: {label: 'Aprovado', color: '#2ecc71'},
  2: {label: 'Cancelada', color: '#e74c3c'},
};
