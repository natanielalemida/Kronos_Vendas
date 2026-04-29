import {useMemo} from 'react';

import {filterOrdersByText} from '../helpers/orders-page.helpers';
import {OrderListItem} from '../types/order.types';

type UseOrdersFiltersParams = {
  orders: OrderListItem[];
  textFilter: string;
};

export function useOrdersFilters({orders, textFilter}: UseOrdersFiltersParams) {
  const filteredOrders = useMemo(() => {
    return filterOrdersByText(orders, textFilter);
  }, [orders, textFilter]);

  return {
    filteredOrders,
  };
}
