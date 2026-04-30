import {CustomerListItem} from '../types/customer-list.types';
import {UseCustomersPageHandlersParams} from '../types/customers-hooks.types';

export function useCustomersPageHandlers({
  handleVerifyCliente,
  setActive,
  setSearchText,
}: UseCustomersPageHandlersParams) {
  const handleCloseModal = () => {
    setActive(false);
  };

  const handleModalVisibilityChange = (value: boolean) => {
    setActive(value);
  };

  return {
    handleCloseModal,
    handleModalVisibilityChange,
    handleOpenCustomerActions: (customer: CustomerListItem) =>
      handleVerifyCliente(customer),
    handleSearchTextChange: setSearchText,
  };
}
