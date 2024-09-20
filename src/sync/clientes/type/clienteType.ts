export type ResponsavelCadastroDto = {
  CodigoUsuario: number;
  Nome: string | null;
  DescontoMaximoVenda: number;
  DescontoMaximoRecebimento: number;
};

export type MunicipioDto = {
  Codigo: number;
  MunicipioCodigo: number;
  MunicipioNome: string | null;
  UFCodigo: number;
  UFNome: string | null;
  UFSigla: string | null;
  PaisCodigo: number;
  PaisNome: string;
};

export type EnderecoDto = {
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
  Municipio: MunicipioDto;
};

export type CategoriaRegiaoDto = {
  Codigo: number;
  Descricao: string;
};

export type ContatoDto = {
  Codigo: number;
  CodigoPessoa: number;
  Tipo: number;
  Contato: string;
};

export type PessoaToSaveDto = {
  Clientes: {
    Codigo: number;
    isSincronizado: number;
    CategoriaCodigo?: number | null;
    RegiaoCodigo?: number | null;
    DiaPagamento: number;
    LimiteCompra: number;
    DescontoMaximo: number;
    TipoPreco?: string | null;
    AcrescimoPercentual: number | null;
    PermiteComprarPazo: boolean;
    CodigoPessoa: number;
    PessoaFJ: number;
    RazaoSocial: string;
    NomeFantasia?: string | null;
    CNPJCPF: string | null;
    IERG?: string | null;
    TipoContribuinte: number;
    Observacao?: string | null;
    Ativo: boolean;
    DataCadastro: Date;
  };
  Enderecos: EnderecoDto[];
  Contatos: ContatoDto[];
};

export type ClienteDto = {
  id: number;
  Codigo: number;
  isSincronizado: number;
  Categoria: CategoriaRegiaoDto | null;
  Regiao: CategoriaRegiaoDto | null;
  DiaPagamento: number;
  LimiteCompra: number;
  BloquearCliente: boolean;
  ForcarAtualizacaoCadastro: boolean;
  CarenciaPagamento: number;
  DescontoMaximo: number;
  DataNascimento: string | null;
  TipoPreco: string | null;
  PessoaReferencia: any[];
  MeiosPagamento: any[];
  AcrescimoPercentual: number | null;
  Veiculos: any | null;
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
  ResponsavelCadastro: ResponsavelCadastroDto;
  Enderecos: EnderecoDto[];
  Contatos: ContatoDto[];
};

export type ClienteResponseTypeDto = {
  Resultado: ClienteDto[];
  Status: number;
  Mensagens: any[];
};
