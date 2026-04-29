import {Dispatch, SetStateAction} from 'react';

import {CondicaoPagamento, FormaPagamento} from '@/modules/sync/types/payment-method-sync.types';

export type SalesCheckoutPaymentConditionItem = {
  id: string;
  title: string;
  amountLabel: string;
  scheduleLines: string[];
};

export type SalesCheckoutPaymentMethodItem = {
  id: string;
  code: number;
  description: string;
  conditions: SalesCheckoutPaymentConditionItem[];
  onPress: () => void;
};

export type SalesCheckoutPageData = {
  discountPercentInput: string;
  grossTotalLabel: string;
  netTotalInput: string;
  note: string;
  paidAmountLabel: string;
  paymentMethods: FormaPagamento[];
  remainingAmountLabel: string;
  selectedPaymentCondition?: CondicaoPagamento;
  selectedPaymentMethod?: FormaPagamento;
  selectedPaymentMethods: SalesCheckoutPaymentMethodItem[];
  totalAmountLabel: string;
};

export type SalesCheckoutPageHandlers = {
  closeDeleteModal: () => void;
  closeFinalizeModal: () => void;
  closePaymentModal: () => void;
  confirmCheckoutDraft: () => void;
  confirmDeletePaymentMethod: () => void;
  confirmFinalizeSale: () => void;
  confirmPaymentMethod: () => void;
  openFinalizeModal: () => void;
  openPaymentModal: () => void;
  setDiscountPercentInput: (value: string) => void;
  setNetTotalInput: (value: string) => void;
  setNote: (value: string) => void;
  setPaymentAmountInput: (value: string) => void;
  setSelectedPaymentCondition: (value: CondicaoPagamento) => void;
  setSelectedPaymentMethod: (value: FormaPagamento) => void;
  syncDiscountPercentInput: () => void;
  syncNetTotalInput: () => void;
};

export type SalesCheckoutPageViewState = {
  isDeleteModalVisible: boolean;
  isFinalizeModalVisible: boolean;
  isPaymentModalVisible: boolean;
  isSaving: boolean;
  shouldAllowFinalize: boolean;
  shouldAllowNewPayment: boolean;
  shouldShowConditionSelector: boolean;
  shouldShowEmptyState: boolean;
};

export type UseSetupSalesCheckoutPageResult = {
  data: SalesCheckoutPageData;
  handlers: SalesCheckoutPageHandlers;
  modalState: {
    paymentAmountInput: string;
    paymentMethodPendingDeletion?: FormaPagamento;
    setDeleteModalVisible: Dispatch<SetStateAction<boolean>>;
  };
  viewState: SalesCheckoutPageViewState;
};
