import {useQuery} from '@tanstack/react-query';

import {OrderController} from '../controllers/order.controller';
import {ordersQueryKeys} from '../query-keys/orders.query-keys';
import {ordersFilterSchema} from '../schemas/orders-filter.schema';
import {OrdersFilterOptions} from '../types/order.types';

const controller = new OrderController();

export function useOrdersQuery(options: OrdersFilterOptions) {
  const parsedOptions = ordersFilterSchema.parse(options);

  return useQuery({
    gcTime: 1000 * 60 * 15,
    placeholderData: previousData => previousData,
    queryFn: () => controller.fetchOrders(parsedOptions),
    queryKey: ordersQueryKeys.list(parsedOptions),
    staleTime: 1000 * 60 * 2,
  });
}
