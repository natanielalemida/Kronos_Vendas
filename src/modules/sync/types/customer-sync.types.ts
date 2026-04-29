export type SyncCustomerResponsavelCadastroDto = {
  CodigoUsuario: number;
  Nome: string | null;
  DescontoMaximoVenda: number;
  DescontoMaximoRecebimento: number;
};

export type SyncCustomerMunicipioDto = {
  Codigo: number;
  MunicipioCodigo: number;
  MunicipioNome: string | null;
  UFCodigo: number;
  UFNome: string | null;
  UFSigla: string | null;
  PaisCodigo: number;
  PaisNome: string;
};

export type SyncCustomerEnderecoDto = {
  CodigoMunicipio: number;
  Codigo: number;
  CodigoPessoa: number;
  Tipo: number;
  TipoDescricao: string;
  CEP: string;
  Logradouro: string;
  Numero: string;
  Bairro: string;
  Complemento: string;
  Municipio: SyncCustomerMunicipioDto;
};

export type SyncCustomerCategoryRegionDto = {
  Codigo: number;
  Descricao: string;
};

export type SyncCustomerContatoDto = {
  Codigo: number;
  CodigoPessoa: number;
  Tipo: number;
  Contato: string;
};

export type SyncCustomerRecordDto = {
  id: number;
  Codigo: number;
  isSincronizado: number;
  Categoria: SyncCustomerCategoryRegionDto | null;
  Regiao: SyncCustomerCategoryRegionDto | null;
  DiaPagamento: number;
  LimiteCompra: number;
  BloquearCliente: boolean;
  ForcarAtualizacaoCadastro: boolean;
  CarenciaPagamento: number;
  DescontoMaximo: number;
  DataNascimento: string | null;
  TipoPreco: string | null;
  PessoaReferencia: unknown[];
  MeiosPagamento: unknown[];
  AcrescimoPercentual: number | null;
  Veiculos: unknown | null;
  PermiteComprarPazo: boolean;
  CodigoPessoa: number;
  PessoaFJ: number;
  RazaoSocial: string;
  NomeFantasia: string;
  CNPJCPF: string;
  IERG: string | null;
  TipoContribuinte: number;
  Observacao: string | null;
  Ativo: boolean;
  DataCadastro: string;
  ResponsavelCadastro: SyncCustomerResponsavelCadastroDto;
  Enderecos: SyncCustomerEnderecoDto[];
  Contatos: SyncCustomerContatoDto[];
};

export type SyncCustomersApiResponse = {
  Resultado: SyncCustomerRecordDto[];
  Status: number;
  Mensagens: string[];
};

export type ClienteDto = SyncCustomerRecordDto;
export type CategoriaRegiaoDto = SyncCustomerCategoryRegionDto;
export type ContatoDto = SyncCustomerContatoDto;
export type EnderecoDto = SyncCustomerEnderecoDto;
