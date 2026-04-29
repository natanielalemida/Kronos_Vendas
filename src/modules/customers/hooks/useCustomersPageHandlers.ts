import {CustomerListItem} from '../types/customer-list.types';
import {UseCustomersPageHandlersParams} from '../types/customers-hooks.types';

export function useCustomersPageHandlers({
  fetchCustomers,
  handleVerifyCliente,
  setActive,
  setSearchText,
}: UseCustomersPageHandlersParams) {
  const handleCloseModal = async () => {
    setActive(false);
    await fetchCustomers();
  };

  const handleModalVisibilityChange = (value: boolean) => {
    setActive(value);

    if (!value) {
      fetchCustomers().catch(error => {
        console.error('Error while reloading customers', error);
      });
    }
  };

  return {
    handleCloseModal,
    handleModalVisibilityChange,
    handleOpenCustomerActions: (customer: CustomerListItem) =>
      handleVerifyCliente(customer),
    handleSearchTextChange: setSearchText,
  };
}
