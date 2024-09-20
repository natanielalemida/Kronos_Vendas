type Municipio = {
  Codigo: number;
  MunicipioCodigo: number;
  MunicipioNome: string;
  UFCodigo: number;
  UFNome: string;
  UFSigla: string;
  PaisCodigo: string;
  PaisNome: string;
};

type Endereco = {
  Codigo: number;
  CodigoPessoa: number;
  Tipo: number;
  TipoDescricao: string;
  CEP: string;
  Logradouro: string;
  Numero: string;
  Bairro: string;
  Complemento: string;
  Municipio: Municipio;
};

type ResponsavelCadastro = {
  CodigoUsuario: number;
  Nome: string;
};

export type EnviarPessoa = {
  Codigo: number;
  Categoria: string | null;
  Regiao: string | null;
  DiaPagamento: number;
  LimiteCompra: number;
  BloquearCliente: boolean;
  ForcarAtualizacaoCadastro: boolean;
  CarenciaPagamento: number;
  DescontoMaximo: number;
  DataNascimento: string | null;
  TipoPreco: string | null;
  PessoaReferencia: string | null;
  AcrescimoPercentual: number;
  Veiculos: string | null;
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
  ResponsavelCadastro: ResponsavelCadastro;
  DataCadastro: string;
  Enderecos: Endereco[];
  Contatos: any[]; // Tipagem ajustável dependendo da estrutura dos contatos
};
