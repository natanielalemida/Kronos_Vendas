import {Dispatch, SetStateAction} from 'react';
import {UserDto} from '@/shared/types';
import {ClienteDto} from '@/modules/sync/types/customer-sync.types';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';
import {FormaPagamento} from '@/modules/sync/types/payment-method-sync.types';
import {LocalParameter} from '@/modules/settings/types/local-parameter.types';
import {
  CustomerForm,
  MunicipalityOption,
} from '@/shared/types/customer-form.types';
import {
  SalesCheckout,
  SelectedOrderSummary,
} from '@/shared/types/sales-draft.types';

export type CompanySummary = unknown;

export type SalesDraftState = {
  selectedCustomer?: ClienteDto;
  selectedProducts: ProdutoBodyCreateQtAndObsDto[];
  selectedPaymentMethods: FormaPagamento[];
  saleCheckout?: SalesCheckout;
  paidAmount: number;
};

export type AppStoreState = {
  customerForm: CustomerForm;
  salesDraft: SalesDraftState;
  user?: UserDto;
  organizationCode?: number;
  isSyncing: boolean;
  localParameters: LocalParameter[];
  municipalities: MunicipalityOption[];
  selectedOrders: SelectedOrderSummary[];
  company: CompanySummary;
  selectedCustomerId: number;
};

export type AppStoreActions = {
  setCustomerForm: (value: CustomerForm) => void;
  clearCustomerForm: () => void;
  setSelectedCustomer: (value: ClienteDto | undefined) => void;
  setSelectedProducts: (
    value:
      | ProdutoBodyCreateQtAndObsDto[]
      | ((
          previousValue: ProdutoBodyCreateQtAndObsDto[],
        ) => ProdutoBodyCreateQtAndObsDto[]),
  ) => void;
  setPaymentMethods: (
    value:
      | FormaPagamento[]
      | ((previousValue: FormaPagamento[]) => FormaPagamento[]),
  ) => void;
  setSaleCheckout: (value: SalesCheckout | undefined) => void;
  setUser: (value: UserDto | undefined) => void;
  setPaidAmount: (value: number) => void;
  setOrganizationCode: (value: number | undefined) => void;
  setIsSyncing: (value: boolean) => void;
  setLocalParameters: (value: LocalParameter[]) => void;
  setMunicipalities: (value: MunicipalityOption[]) => void;
  setSelectedOrders: (value: SelectedOrderSummary[]) => void;
  setCompany: (value: CompanySummary) => void;
  setSelectedCustomerId: (value: number) => void;
  clearSalesDraft: () => void;
  clearAllState: () => void;
};

export type AppStore = AppStoreState & AppStoreActions;
export type StoreSetter<T> = Dispatch<SetStateAction<T>>;
