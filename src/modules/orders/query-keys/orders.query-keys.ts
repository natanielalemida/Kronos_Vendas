import {OrdersFilterOptions} from '../types/order.types';

export const ordersQueryKeys = {
  all: ['orders'] as const,
  list: (options: OrdersFilterOptions) =>
    [...ordersQueryKeys.all, 'list', options] as const,
  summary: (orderId: number | undefined, terminal: number) =>
    [...ordersQueryKeys.all, 'summary', orderId ?? 'unknown', terminal] as const,
};
