import {useQuery} from '@tanstack/react-query';
import {useRef} from 'react';

import {OrderSummaryRepository} from '../repositories/order-summary.repository';
import {ordersQueryKeys} from '../query-keys/orders.query-keys';

export function useOrderSummaryQuery(
  orderId: number | undefined,
  terminal: number | undefined,
) {
  const repositoryRef = useRef(new OrderSummaryRepository());

  return useQuery({
    enabled: typeof orderId === 'number',
    gcTime: 1000 * 60 * 15,
    placeholderData: previousData => previousData,
    queryFn: () => repositoryRef.current.findById(orderId as number, terminal ?? 0),
    queryKey: ordersQueryKeys.summary(orderId, terminal ?? 0),
    staleTime: 1000 * 60 * 5,
  });
}
