import {OrdersPageRouteParams} from './orders-page.types';

export type OrdersPageNavigation = {
  goBack: () => void;
  navigate: (routeName: string, params?: Record<string, unknown>) => void;
  setParams?: (params: OrdersPageRouteParams) => void;
  toggleDrawer?: () => void;
};
