import {Alert} from 'react-native';
import ApiInstace from '../../api/ApiInstace';
import {UsuarioDto} from '../../modules/login/hooks/type';
import ClienteService from './service/clienteService';
import {ClienteDto, ClienteResponseTypeDto} from './type';

export default class SincronizarCliente {
  private usuario: UsuarioDto;
  private organizationCode: Number;
  private service: ClienteService;

  constructor(usuario: UsuarioDto, organizationCode: number) {
    this.usuario = usuario;
    this.organizationCode = organizationCode;
    this.service = new ClienteService();
  }

  private async verify(data: ClienteResponseTypeDto) {
    const successfully = Array.isArray(data.Mensagens);
    if (!successfully) {
      throw new Error('Falha ao sincronizar clientes');
    }

    await this.save(data.Resultado);
  }

  private async save(cliente: ClienteDto[]) {
    try {
      await this.service.save(cliente);
    } catch (error) {
      const er = error as Error;
      Alert.alert(`${er.name}`, `${er.message}`);
    }
  }

  async runSync() {
    const data = await ApiInstace.openUrl({
      data: undefined,
      method: 'get',
      endPoint:
        'arc/cliente/vendas/mobile?CodigoRegiao=null;CodigoCategoria=null',
      headers: {
        Auth: this.usuario.Hash,
        Empresa: this.organizationCode,
      },
    });

    await this.verify(data);
  }
}
