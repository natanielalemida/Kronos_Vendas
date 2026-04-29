import {Dispatch, SetStateAction} from 'react';

import {OrdersFilterOptions} from './order.types';
import {OrdersFilterModalPosition} from './orders-page.types';

export type OrdersFilterModalProps = {
  onClose: () => void;
  options: OrdersFilterOptions;
  position: OrdersFilterModalPosition;
  setOptions: Dispatch<SetStateAction<OrdersFilterOptions>>;
  visible: boolean;
};
