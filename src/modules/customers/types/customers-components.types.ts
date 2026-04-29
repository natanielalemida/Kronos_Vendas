import {CustomerListItem, CustomerListItemAddress} from './customer-list.types';

export type CustomerListItemProps = {
  customer: CustomerListItem;
  index: number;
  onPress: (customer: CustomerListItem) => void;
};

export type CustomerAddressListProps = {
  addresses: CustomerListItemAddress[];
};
