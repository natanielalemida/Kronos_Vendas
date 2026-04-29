import {useSyncExecution} from '@/modules/sync/hooks/useSyncExecution';
import {useAppStore} from '@/shared/store/useAppStore';

import {AppSession} from '../types/app-session.types';

export function useAppSession(): AppSession {
  const {isRunning} = useSyncExecution();
  const {
    customerForm,
    salesDraft,
    user,
    organizationCode,
    localParameters,
    municipalities,
    selectedOrders,
    company,
    selectedCustomerId,
    setCustomerForm,
    clearCustomerForm,
    setSelectedCustomer,
    setSelectedProducts,
    setPaymentMethods,
    setSaleCheckout,
    setUser,
    setPaidAmount,
    setOrganizationCode,
    setLocalParameters,
    setMunicipalities,
    setSelectedOrders,
    setCompany,
    setSelectedCustomerId,
    clearSalesDraft,
    clearAllState,
  } = useAppStore();

  return {
    form: customerForm,
    setForm: setCustomerForm,
    handleClearForm: clearCustomerForm,
    clienteOnContext: salesDraft.selectedCustomer,
    setClienteOnContext: setSelectedCustomer,
    ProdutosSelecionados: salesDraft.selectedProducts,
    setProdutosSelecionados: setSelectedProducts,
    formaPagamento: salesDraft.selectedPaymentMethods,
    setFormaPagameto: setPaymentMethods,
    finalizarVenda: salesDraft.saleCheckout,
    setFinalizarVenda: setSaleCheckout,
    usuario: user,
    setUsuario: setUser,
    valorPago: salesDraft.paidAmount,
    setValorPago: setPaidAmount,
    organizationCode,
    setOrganizationCode,
    isSyncing: isRunning,
    setIsSyncing: () => undefined,
    params: localParameters,
    setParams: setLocalParameters,
    municipios: municipalities,
    setMunicipios: setMunicipalities,
    pedidosSelecionados: selectedOrders,
    setPedidosSelecionados: setSelectedOrders,
    cleanPedido: clearSalesDraft,
    clearAllContext: clearAllState,
    empresa: company,
    setEmpresa: setCompany,
    clienteId: selectedCustomerId,
    setClienteId: setSelectedCustomerId,
  };
}
