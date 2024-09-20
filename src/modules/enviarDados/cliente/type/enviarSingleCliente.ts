// Tipagem para o objeto `Municipio`
type MunicipioDto = {
  Codigo: number;
  MunicipioCodigo: number;
  MunicipioNome: string;
  UFCodigo: number;
  UFNome: string;
  UFSigla: string;
  PaisCodigo: number;
  PaisNome: string;
};

// Tipagem para o objeto `Endereco`
type EnderecoDto = {
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

// Tipagem para o objeto `FormaPagto`
type FormaPagtoDto = {
  Codigo: number;
  Descricao: string;
  PermiteRecebimento: boolean;
  PermitePagamentoPromocao: boolean;
  Ativo: boolean;
  FormaPagamentoPadrao: number;
  CondicoesPagamento: any[]; // Substitua `any[]` com o tipo correto se houver detalhes sobre `CondicoesPagamento`
  Operadora: any; // Substitua `any` com o tipo correto se houver detalhes sobre `Operadora`
  Identificador: number;
  EmissaoCupomFiscalObrigatoria: boolean;
  UtilizaCreditoDevolucao: boolean;
  SolicitarDadosOperadoraBandeiraCartao: boolean;
  CodigoContaBancaria: any; // Substitua `any` com o tipo correto se houver detalhes sobre `CodigoContaBancaria`
  IsPrazo: boolean;
  IsCartao: boolean;
  IsRecebimentoEmConta: boolean;
};

// Tipagem para o objeto `MeioPagamento`
type MeioPagamentoDto = {
  Codigo: number;
  CodigoCliente: number;
  DescricaoFP: string;
  FormaPagto: FormaPagtoDto;
  PossuiFormaPagamentoPrazo: boolean;
};

// Tipagem para o objeto `ResponsavelCadastro`
type ResponsavelCadastroDto = {
  CodigoUsuario: number;
  Nome: string;
  DescontoMaximoVenda: number;
  DescontoMaximoRecebimento: number;
};

// Tipagem para o objeto principal `Resultado`
type ResultadoSingleClienteDto = {
  Codigo: number;
  Categoria: any; // Substitua `any` com o tipo correto se houver detalhes sobre `Categoria`
  Regiao: any; // Substitua `any` com o tipo correto se houver detalhes sobre `Regiao`
  DiaPagamento: number;
  LimiteCompra: number;
  BloquearCliente: boolean;
  ForcarAtualizacaoCadastro: boolean;
  CarenciaPagamento: number;
  DescontoMaximo: number;
  DataNascimento: any; // Substitua `any` com o tipo correto se houver detalhes sobre `DataNascimento`
  TipoPreco: any; // Substitua `any` com o tipo correto se houver detalhes sobre `TipoPreco`
  PessoaReferencia: any[]; // Substitua `any[]` com o tipo correto se houver detalhes sobre `PessoaReferencia`
  MeiosPagamento: MeioPagamentoDto[];
  AcrescimoPercentual: number;
  Veiculos: any; // Substitua `any` com o tipo correto se houver detalhes sobre `Veiculos`
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
  DataCadastro: string;
  ResponsavelCadastro: ResponsavelCadastroDto;
  Enderecos: EnderecoDto[];
  Contatos: any[]; // Substitua `any[]` com o tipo correto se houver detalhes sobre `Contatos`
};

// Tipagem para o objeto principal que inclui `Resultado`
type ApiResponseDto = {
  Resultado: ResultadoSingleClienteDto;
  Status: number;
  Mensagens: any[]; // Substitua `any[]` com o tipo correto se houver detalhes sobre `Mensagens`
};
