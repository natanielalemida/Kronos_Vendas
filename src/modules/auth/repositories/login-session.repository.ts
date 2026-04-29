import {knexConfig} from '../../../database/connection';
import {UserDto} from '@/shared/types';

export class LoginSessionRepository {
  async saveUser(user: UserDto, password: string): Promise<void> {
    await this.deleteAllUsers();
    await knexConfig('usuarios').insert({
      codigo: user.Codigo,
      codigo_pessoa: user.CodigoPessoa,
      referencia: user.Referencia,
      login: user.Login,
      senha: password,
      senha_confirmacao: user.SenhaConfirmacao,
      hash: user.Hash,
      cargo_descricao: user.CargoDescricao,
      desconto_maximo_venda: user.DescontoMaximoVenda,
      desconto_maximo_recebimento: user.DescontoMaximoRecebimento,
      usuario_administrador: user.UsuarioAdministrador,
      image: user.Image,
      created_at: new Date(),
      updated_at: null,
    });
  }

  async saveCompany(companyJson: string, companyCode: string): Promise<void> {
    await this.deleteAllCompanies();
    await knexConfig('empresaLogin').insert({
      empresaJson: companyJson,
      codigo_empresa: companyCode,
    });
  }

  async getCompany(): Promise<string | undefined> {
    const query = await knexConfig('empresaLogin')
      .select('empresaLogin.empresaJson')
      .first();

    if (!query) {
      return undefined;
    }

    return JSON.parse(query.empresaJson);
  }

  async getUser(cpf: string, password: string): Promise<UserDto | undefined> {
    const query = await knexConfig('usuarios')
      .select('*')
      .where('login', cpf)
      .andWhere('senha', password)
      .first();

    if (!query) {
      return undefined;
    }

    return {
      Codigo: query.codigo,
      CodigoPessoa: query.codigo_pessoa,
      Referencia: query.referencia,
      Login: query.login,
      Senha: '',
      SenhaConfirmacao: query.senha_confirmacao,
      Hash: query.hash,
      CargoDescricao: query.cargo_descricao,
      DescontoMaximoVenda: query.desconto_maximo_venda,
      DescontoMaximoRecebimento: query.desconto_maximo_recebimento,
      UsuarioAdministrador: query.usuario_administrador,
      Image: query.image,
      Privilegios: [],
      CNPJCPF: query.login,
      AsResponsavelOperacao: {
        CodigoUsuario: query.codigo,
        Nome: query.login,
        DescontoMaximoVenda: query.desconto_maximo_venda,
        DescontoMaximoRecebimento: query.desconto_maximo_recebimento,
      },
    };
  }

  async deleteAllUsers(): Promise<void> {
    await knexConfig('usuarios').del();
  }

  async deleteAllCompanies(): Promise<void> {
    await knexConfig('empresaLogin').del();
  }
}
