import {Alert} from 'react-native';
import ApiInstace from '../../api/ApiInstace';
import {UsuarioDto} from '../../modules/login/hooks/type';
import PagamentoService from './service/pagamentoService';
import {FormaPagamentoDto, pagamentoDtoDto} from './type';

export default class SincronizarPagamentos {
  private usuario: UsuarioDto;
  private organizationCode: Number;
  private service: PagamentoService;

  constructor(usuario: UsuarioDto, organizationCode: number) {
    this.usuario = usuario;
    this.organizationCode = organizationCode;
    this.service = new PagamentoService();
  }

  private async verify(data: pagamentoDtoDto) {
    const successfully = Array.isArray(data.Mensagens);
    if (!successfully) {
      throw new Error('Falha ao sincronizar forma de pagamentos');
    }

    await this.save(data.Resultado);
  }

  private async save(produtos: FormaPagamentoDto[]) {
    try {
      await this.service.save(produtos);
    } catch (error) {
      const er = error as Error;
      Alert.alert(`${er.name}`, `${er.message}`);
    }
  }

  async runSync() {
    const data = await ApiInstace.openUrl({
      data: undefined,
      method: 'get',
      endPoint: 'arc/formapagamento',
      headers: {
        Auth: this.usuario.Hash,
        Empresa: this.organizationCode,
      },
    });

    await this.verify(data);
  }
}
