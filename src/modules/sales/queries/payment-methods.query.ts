import {useQuery} from '@tanstack/react-query';
import {useRef} from 'react';

import {salesQueryKeys} from '../query-keys/sales.query-keys';
import {SalesCheckoutRepository} from '../repositories/sales-checkout.repository';

export function useSalesPaymentMethodsQuery() {
  const repositoryRef = useRef(new SalesCheckoutRepository());

  return useQuery({
    gcTime: 1000 * 60 * 30,
    queryKey: salesQueryKeys.paymentMethods(),
    queryFn: () => repositoryRef.current.getPaymentMethods(),
    staleTime: 1000 * 60 * 10,
  });
}
