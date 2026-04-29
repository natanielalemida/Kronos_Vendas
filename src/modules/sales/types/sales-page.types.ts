import {CustomerListItemAddress} from '@/modules/customers/types/customer-list.types';

export type SalesCustomerSummary = {
  id?: number;
  name?: string;
  document?: string;
  addressLines: string[];
};

export type SalesProductListItem = {
  id: string;
  code: number;
  description: string;
  quantity: number;
  unitPriceLabel: string;
  totalPriceLabel: string;
  note?: string;
  backgroundColor: string;
  onPress: () => void;
};

export type UseSetupNewOrderPageResult = {
  customerSummary: SalesCustomerSummary;
  hasSelectedCustomer: boolean;
  hasSelectedProducts: boolean;
  selectedProducts: SalesProductListItem[];
  totalPriceLabel: string;
  handleOpenProductActions: () => void;
  handleOpenCustomerHistory: () => void;
  handleOpenCustomers: () => void;
  handleOpenProducts: () => void;
  handleGoToCheckout: () => void;
};

export type SalesActionButtonProps = {
  iconName: 'add-sharp' | 'people-sharp' | 'checkmark-circle-sharp';
  label: string;
  onPress: () => void;
};

export type SalesCustomerSummaryCardProps = {
  customer: SalesCustomerSummary;
  onOpenHistory: () => void;
};

export type SalesSelectedProductItemProps = {
  product: SalesProductListItem;
};

export type SalesAddressLineSource = CustomerListItemAddress;
