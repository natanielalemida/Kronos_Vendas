import {
  ClienteDto,
  ContatoDto,
  EnderecoDto,
} from '@/modules/sync/types/customer-sync.types';
import {CustomerListItem} from '@/modules/customers/types/customer-list.types';

export type CustomerSearchRow = {
  id: number;
  Codigo: number;
  CodigoPessoa?: number;
  NomeFantasia: string;
  RazaoSocial: string;
  CNPJCPF: string;
  TipoPreco: string | null;
  isSincronizado: number;
  Bairro?: string;
  Logradouro?: string;
  Numero?: string;
  Complemento?: string;
};

export type GroupedCustomerRow = CustomerListItem;

export type CustomerSearchResult = {
  data: GroupedCustomerRow[];
  total: {
    count: number;
  };
};

export type MappedCustomerInsert = {
  customer: {
    Codigo: number;
    CategoriaCodigo: number | null;
    RegiaoCodigo: number | null;
    DiaPagamento: number;
    LimiteCompra: number;
    DescontoMaximo: number;
    TipoPreco: string | null;
    AcrescimoPercentual: number | null;
    PermiteComprarPazo: boolean;
    CodigoPessoa: number;
    isSincronizado: number;
    PessoaFJ: number;
    RazaoSocial: string;
    NomeFantasia: string | null;
    CNPJCPF: string | null;
    IERG: string | null;
    TipoContribuinte: number;
    Observacao: string | null;
    Ativo: boolean;
    DataCadastro: Date;
  };
  addresses: EnderecoDto[];
  contacts: ContatoDto[];
};

export type CustomerInsertSource = ClienteDto;
