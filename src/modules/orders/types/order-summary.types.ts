import {EditableCustomerRecord} from '@/modules/customers/types/customer-edit.types';
import {ProdutoBodyCreateQtAndObsDto} from '@/modules/sync/types/product-sync.types';

export type OrderSummaryRouteParams = {
  Codigo?: number;
  goBack?: boolean;
  id: number;
  idCliente?: number | null;
};

export type OrderSummaryNavigation = {
  goBack: () => void;
  navigate: (routeName: string, params?: Record<string, unknown>) => void;
  pop: (count?: number) => void;
};

export type OrderSummaryCustomer = {
  CNPJCPF: string;
  Codigo?: number | null;
  NomeFantasia: string;
  RazaoSocial?: string | null;
  TipoPreco?: string | null;
  id: number;
};

export type OrderSummaryProduct = ProdutoBodyCreateQtAndObsDto & {
  CodigoProduto: number;
  ValorCusto: number;
  ValorOriginalProduto: number;
  ValorUnitario: number;
};

export type OrderSummaryPaymentMethod = {
  FormaPagamento: {
    Descricao: string;
  };
  ValorRecebido: number;
};

export type OrderSummaryRecord = {
  Codigo?: number | null;
  DataEmissao: string;
  Itens: OrderSummaryProduct[];
  MeiosPagamentos: OrderSummaryPaymentMethod[];
  Observacao?: string | null;
  Pessoa: OrderSummaryCustomer;
  id: number;
};

export type OrderSummaryCompanyAddress = {
  Bairro: string;
  CEP: string;
  Complemento?: string | null;
  Logradouro: string;
  Municipio?: {
    MunicipioNome?: string | null;
    UFSigla?: string | null;
  };
  Numero: string;
};

export type OrderSummaryCompanyContact = {
  Contato?: string | null;
  Tipo: number;
};

export type OrderSummaryCompany = {
  AsEmpresaOperacao?: {
    CNPJ?: string;
    NomeFantasia?: string;
  };
  Codigo?: number;
  Contatos?: OrderSummaryCompanyContact[];
  Enderecos?: OrderSummaryCompanyAddress[];
  ImgLogo?: string;
};

export type OrderSummaryDisplayProduct = {
  id: string;
  description: string;
  discountLabel: string;
  quantityLabel: string;
  totalPriceLabel: string;
  unitPriceLabel: string;
};

export type OrderSummaryDisplayPaymentMethod = {
  id: string;
  amountLabel: string;
  description: string;
};

export type UseSetupOrderSummaryPageResult = {
  data: {
    customerDocumentLabel: string;
    customerName: string;
    discountAmountLabel: string;
    discountPercentLabel: string;
    issuedAtLabel: string;
    order?: OrderSummaryRecord;
    paymentMethods: OrderSummaryDisplayPaymentMethod[];
    products: OrderSummaryDisplayProduct[];
    totalGross: number;
    totalGrossLabel: string;
    totalNet: number;
    totalNetLabel: string;
  };
  derivedState: {
    isSyncedOrder: boolean;
  };
  handlers: {
    handleDeleteOrder: () => void;
    handleDuplicateOrder: () => void;
    handleEditOrder: () => Promise<void>;
    handleGoBack: () => void;
    handleSendOrder: () => Promise<void>;
    handleSharePdf: () => Promise<void>;
  };
  viewState: {
    isLoading: boolean;
  };
};

export type OrderSummaryCustomerResolver = (
  customerId: number,
) => Promise<EditableCustomerRecord>;
