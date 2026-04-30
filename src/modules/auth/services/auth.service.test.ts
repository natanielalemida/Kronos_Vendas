import {beforeEach, describe, expect, it, jest} from '@jest/globals';

import ApiInstace from '@/api/ApiInstace';

import {AuthService} from './auth.service';

jest.mock('@/api/ApiInstace', () => ({
  __esModule: true,
  default: {
    openUrl: jest.fn(),
  },
}));

describe('AuthService', () => {
  const authService = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts login payload to the login endpoint and parses the response', async () => {
    const response = {
      Resultado: {
        Usuario: {
          AsResponsavelOperacao: {
            CodigoUsuario: 1,
            DescontoMaximoRecebimento: 0,
            DescontoMaximoVenda: 0,
            Nome: 'Admin',
          },
          CargoDescricao: 'Administrador',
          CNPJCPF: '',
          Codigo: 1,
          CodigoPessoa: 1,
          DescontoMaximoRecebimento: 0,
          DescontoMaximoVenda: 0,
          Hash: 'hash',
          Image: null,
          Login: 'admin',
          Privilegios: [],
          Referencia: 'Admin',
          Senha: '',
          SenhaConfirmacao: null,
          UsuarioAdministrador: true,
        },
      },
      Status: 1,
      Mensagens: [],
    };

    (ApiInstace.openUrl as ReturnType<typeof jest.fn>).mockResolvedValue(response);

    const result = await authService.login({
      Aplicacao: 6,
      Login: 'admin',
      NumeroTerminal: 1,
      Senha: 'arc123',
      codigoEmpresa: 1,
    });

    expect(ApiInstace.openUrl).toHaveBeenCalledWith({
      data: {
        Aplicacao: 6,
        Login: 'admin',
        NumeroTerminal: 1,
        Senha: 'arc123',
        codigoEmpresa: 1,
      },
      endPoint: 'arc/usuario/login',
      headers: undefined,
      method: 'post',
    });
    expect(result).toEqual(response);
  });

  it('requests company data from the company endpoint', async () => {
    const response = {
      Resultado: {
        Codigo: 1,
        NomeFantasia: 'DEMO RESTAURANTE',
      },
      Mensagens: [],
    };

    (ApiInstace.openUrl as ReturnType<typeof jest.fn>).mockResolvedValue(response);

    const result = await authService.getCompany(1);

    expect(ApiInstace.openUrl).toHaveBeenCalledWith({
      data: undefined,
      endPoint: 'arc/empresa/1',
      headers: undefined,
      method: 'get',
    });
    expect(result).toEqual(response);
  });
});
