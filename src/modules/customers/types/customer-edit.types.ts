import {CustomerForm, CustomerFormToSave, MunicipalityOption} from '@/shared/types/customer-form.types';
import {CustomerListItem} from './customer-list.types';

export type EditableCustomerRecord = {
  id?: number;
  Codigo?: number | null;
  CodigoPessoa?: number | null;
  CNPJCPF?: string | null;
  IERG?: string | null;
  NomeFantasia?: string | null;
  RazaoSocial?: string | null;
  Logradouro?: string | null;
  Numero?: string | null;
  Bairro?: string | null;
  Complemento?: string | null;
  CEP?: string | null;
  isSincronizado?: number | null;
  TipoPreco?: string | null;
  LimiteCompra?: number | null;
  DescontoMaximo?: number | null;
  DiaPagamento?: number | null;
  Municipio?: MunicipalityOption | undefined;
  EnderecoId?: number | undefined;
  Contatos: {
    Celular: {Codigo?: number; Tipo: number; Contato: string}[];
    Email: {Codigo?: number; Tipo: number; Contato: string}[];
  };
};

export type CustomerActionsModalProps = {
  customer?: CustomerListItem;
  isVisible: boolean;
  onClose: (value: boolean) => void;
};

export type UseCustomerActionsModalResult = {
  handlers: {
    handleDeleteCustomer: () => void;
    handleEditCustomer: () => Promise<void>;
  };
  viewState: {
    isSyncedCustomer: boolean;
  };
};

export type CustomerFormPersistence = {
  toSavePayload: CustomerFormToSave;
};

export type CustomerFormState = CustomerForm;
