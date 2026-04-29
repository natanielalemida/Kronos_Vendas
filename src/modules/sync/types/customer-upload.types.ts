import {
  ClienteDto,
  SyncCustomerCategoryRegionDto,
  SyncCustomerContatoDto,
  SyncCustomerEnderecoDto,
  SyncCustomerResponsavelCadastroDto,
} from './customer-sync.types';
import {SyncProgress} from './sync.types';

export type UploadCustomersResult = {
  uploadedCustomersCount: number;
};

export type CustomerUploadDependencies = {
  userHash: string;
  progressCallback?: (value: SyncProgress | undefined) => void;
};

export type CustomerUploadApiPayload = {
  Codigo: number;
  Categoria: number | string | null;
  Regiao: number | string | null;
  DiaPagamento: number;
  LimiteCompra: number;
  BloquearCliente: boolean;
  ForcarAtualizacaoCadastro: boolean;
  CarenciaPagamento: number;
  DescontoMaximo: number;
  DataNascimento: string | null;
  TipoPreco: string | null;
  PessoaReferencia: unknown[] | string | null;
  AcrescimoPercentual: number;
  Veiculos: unknown | string | null;
  PermiteComprarPazo: boolean;
  CodigoPessoa: number;
  PessoaFJ: number;
  RazaoSocial: string;
  NomeFantasia: string;
  CNPJCPF: string;
  IERG: string;
  TipoContribuinte: number;
  Observacao: string;
  Ativo: boolean;
  ResponsavelCadastro: {
    CodigoUsuario: number;
    Nome?: string | null;
  };
  DataCadastro: string;
  Enderecos: {
    Codigo: number;
    CodigoPessoa: number;
    Tipo: number;
    TipoDescricao: string;
    CEP: string;
    Logradouro: string;
    Numero: string;
    Bairro: string;
    Complemento: string;
    Municipio: {
      Codigo: number;
      MunicipioCodigo: number;
      MunicipioNome?: string;
      UFCodigo?: number;
      UFNome?: string;
      UFSigla?: string;
      PaisCodigo?: string | number;
      PaisNome?: string;
    };
  }[];
  Contatos:
    | {
        Codigo: number;
        CodigoPessoa: number;
        Tipo: number;
        Contato: string;
      }[]
    | null;
};

export type PendingCustomerPayload = CustomerUploadApiPayload;

export type CustomerUploadResult = ClienteDto & {
  Categoria: SyncCustomerCategoryRegionDto | null;
  Regiao: SyncCustomerCategoryRegionDto | null;
  ResponsavelCadastro: SyncCustomerResponsavelCadastroDto;
  Enderecos: SyncCustomerEnderecoDto[];
  Contatos: SyncCustomerContatoDto[];
};

export type CustomerUploadApiResponse = {
  Resultado: CustomerUploadResult;
  Status: number;
  Mensagens: {
    Conteudo?: string;
    conteudo?: string;
  }[];
};

export type {SyncProgress};
