import {create} from 'zustand';

import {createEmptyCustomerForm} from '@/shared/factories/customerForm.factory';

import {
  AppStore,
  CompanySummary,
  SalesDraftState,
} from './types/appState.types';

const createEmptySalesDraft = (): SalesDraftState => ({
  selectedCustomer: undefined,
  selectedProducts: [],
  selectedPaymentMethods: [],
  saleCheckout: undefined,
  paidAmount: 0,
});

const createInitialCompany = (): CompanySummary => ({});

const initialState = {
  customerForm: createEmptyCustomerForm(),
  salesDraft: createEmptySalesDraft(),
  user: undefined,
  organizationCode: undefined,
  isSyncing: false,
  localParameters: [],
  municipalities: [],
  selectedOrders: [],
  company: createInitialCompany(),
  selectedCustomerId: 0,
};

export const useAppStore = create<AppStore>(set => ({
  ...initialState,
  setCustomerForm: value => set({customerForm: value}),
  clearCustomerForm: () => set({customerForm: createEmptyCustomerForm()}),
  setSelectedCustomer: value =>
    set(state => ({
      salesDraft: {
        ...state.salesDraft,
        selectedCustomer: value,
      },
    })),
  setSelectedProducts: value =>
    set(state => ({
      salesDraft: {
        ...state.salesDraft,
        selectedProducts:
          typeof value === 'function'
            ? value(state.salesDraft.selectedProducts)
            : value,
      },
    })),
  setPaymentMethods: value =>
    set(state => ({
      salesDraft: {
        ...state.salesDraft,
        selectedPaymentMethods:
          typeof value === 'function'
            ? value(state.salesDraft.selectedPaymentMethods)
            : value,
      },
    })),
  setSaleCheckout: value =>
    set(state => ({
      salesDraft: {
        ...state.salesDraft,
        saleCheckout: value,
      },
    })),
  setUser: value => set({user: value}),
  setPaidAmount: value =>
    set(state => ({
      salesDraft: {
        ...state.salesDraft,
        paidAmount: value,
      },
    })),
  setOrganizationCode: value => set({organizationCode: value}),
  setIsSyncing: value => set({isSyncing: value}),
  setLocalParameters: value => set({localParameters: value}),
  setMunicipalities: value => set({municipalities: value}),
  setSelectedOrders: value => set({selectedOrders: value}),
  setCompany: value => set({company: value}),
  setSelectedCustomerId: value => set({selectedCustomerId: value}),
  clearSalesDraft: () => set({salesDraft: createEmptySalesDraft()}),
  clearAllState: () =>
    set({
      ...initialState,
      customerForm: createEmptyCustomerForm(),
      salesDraft: createEmptySalesDraft(),
      company: createInitialCompany(),
    }),
}));
