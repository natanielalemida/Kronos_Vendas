import { knexConfig } from "../../../database/connection";
import { UsuarioDto } from "../hooks/type";

export default class SaveLoginRepository {
    public async saveUser(resultado: UsuarioDto, password: string): Promise<void> {
      await this.deleteAll();
      await knexConfig('usuarios').insert({
        codigo: resultado.Codigo,
        codigo_pessoa: resultado.CodigoPessoa,
        referencia: resultado.Referencia,
        login: resultado.Login,
        senha: password,
        senha_confirmacao: resultado.SenhaConfirmacao,
        hash: resultado.Hash,
        cargo_descricao: resultado.CargoDescricao,
        desconto_maximo_venda: resultado.DescontoMaximoVenda,
        desconto_maximo_recebimento: resultado.DescontoMaximoRecebimento,
        usuario_administrador: resultado.UsuarioAdministrador,
        image: resultado.Image,
        created_at: new Date(),
        updated_at: null,
      });
    }
  
    public async getUser(cpf: string, password: string): Promise<UsuarioDto | undefined> {
      const query = await knexConfig('usuarios').select('*').where('login', cpf).andWhere('senha', password).first();
  
      if (!query) {
        return undefined;
      }
  
      return {
        Codigo: query.codigo,
        CodigoPessoa: query.codigo_pessoa,
        Referencia: query.referencia,
        Login: query.login,
        Senha: "", // Sempre retornando senha vazia
        SenhaConfirmacao: query.senha_confirmacao,
        Hash: query.hash,
        CargoDescricao: query.cargo_descricao,
        DescontoMaximoVenda: query.desconto_maximo_venda,
        DescontoMaximoRecebimento: query.desconto_maximo_recebimento,
        UsuarioAdministrador: query.usuario_administrador,
        Image: query.image,
      };
    }
  
    public async deleteAll(): Promise<void> {
      await knexConfig('usuarios').del();
    }
  
    public async deleteAllPrivilegios(): Promise<void> {
      await knexConfig('privilegios').del();
    }
  }
  