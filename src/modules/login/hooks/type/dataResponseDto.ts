export type UsuarioDto = {
  Codigo: number;
  CodigoPessoa: number;
  Referencia: string;
  Login: string;
  Senha: string;
  SenhaConfirmacao: string | null;
  Hash: string;
  CargoDescricao: string;
  DescontoMaximoVenda: number;
  DescontoMaximoRecebimento: number;
  UsuarioAdministrador: boolean;
  Image: string | null;
  Privilegios: string[];
  CNPJCPF: string;
  AsResponsavelOperacao: {
    CodigoUsuario: number;
    Nome: string;
    DescontoMaximoVenda: number;
    DescontoMaximoRecebimento: number;
  };
};

type ResultadoValidacaoLicenca = {
  Resultado: number;
  DataProximaChecagem: string;
  NumeroLicencas: number;
  DataValidadeDaLicenca: string | null;
};

export type ResultadoLoginDto = {
  Usuario: UsuarioDto;
  ResultadoValidacaoLicenca: ResultadoValidacaoLicenca;
};

export type MainResponse = {
  Resultado: ResultadoLoginDto;
  Status: number;
  Mensagens: string[];
};
