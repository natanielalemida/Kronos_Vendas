import {colors} from '@/modules/styles';

import {OrderListItem} from '../types/order.types';

export function filterOrdersByText(
  orders: OrderListItem[],
  textFilter: string,
): OrderListItem[] {
  const normalizedFilter = textFilter.trim().toLowerCase();

  if (!normalizedFilter) {
    return orders;
  }

  return orders.filter(order => {
    const searchableValues = [
      order.Codigo?.toString() ?? '',
      order.NomeFantasia ?? '',
      order.DataEmissao ?? '',
    ];

    return searchableValues.some(value =>
      value.toLowerCase().includes(normalizedFilter),
    );
  });
}

export function getOrderRowBackgroundColor(
  index: number,
  isSelected: boolean,
): string {
  if (isSelected) {
    return colors.arcGreen;
  }

  return index % 2 === 0 ? colors.grayList : colors.white;
}
