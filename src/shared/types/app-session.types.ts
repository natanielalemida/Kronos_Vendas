import {ClienteDto} from '@/modules/sync/types/customer-sync.types';
import {FormaPagamento} from '@/modules/sync/types/payment-method-sync.types';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';
import {LocalParameter} from '@/modules/settings/types/local-parameter.types';
import {UserDto} from '@/shared/types';

import {CompanySummary} from '@/shared/store/types/appState.types';
import {CustomerForm, MunicipalityOption} from './customer-form.types';
import {SalesCheckout, SelectedOrderSummary} from './sales-draft.types';

export type AppSession = {
  setForm: (value: CustomerForm) => void;
  form: CustomerForm;
  handleClearForm: () => void;
  clienteOnContext: ClienteDto | undefined;
  setClienteOnContext: (value: ClienteDto | undefined) => void;
  ProdutosSelecionados: ProdutoBodyCreateQtAndObsDto[];
  setProdutosSelecionados: (
    value:
      | ProdutoBodyCreateQtAndObsDto[]
      | ((
          previousValue: ProdutoBodyCreateQtAndObsDto[],
        ) => ProdutoBodyCreateQtAndObsDto[]),
  ) => void;
  formaPagamento: FormaPagamento[] | undefined;
  setFormaPagameto: (
    value:
      | FormaPagamento[]
      | ((previousValue: FormaPagamento[]) => FormaPagamento[]),
  ) => void;
  finalizarVenda: SalesCheckout | undefined;
  setFinalizarVenda: (value: SalesCheckout | undefined) => void;
  usuario: UserDto | undefined;
  setUsuario: (value: UserDto | undefined) => void;
  valorPago: number;
  setValorPago: (value: number) => void;
  organizationCode: number | undefined;
  setOrganizationCode: (value: number | undefined) => void;
  isSyncing: boolean;
  setIsSyncing: (value: boolean) => void;
  params: LocalParameter[];
  setParams: (value: LocalParameter[]) => void;
  municipios: MunicipalityOption[];
  setMunicipios: (value: MunicipalityOption[]) => void;
  pedidosSelecionados: SelectedOrderSummary[];
  setPedidosSelecionados: (value: SelectedOrderSummary[]) => void;
  cleanPedido: () => void;
  clearAllContext: () => void;
  empresa: CompanySummary;
  setEmpresa: (value: CompanySummary) => void;
  clienteId: number;
  setClienteId: (value: number) => void;
};
