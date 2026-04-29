export type UserDto = {
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
