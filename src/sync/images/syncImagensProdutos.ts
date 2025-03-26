import {Alert} from 'react-native';
import ApiInstace from '../../api/ApiInstace';
import {UsuarioDto} from '../../modules/login/hooks/type';
import ImageService from './service/syncImageService';
import { PedidoResponse } from '../pedidos/type';

export default class SincronizarImages {
  private usuario: UsuarioDto;
  private organizationCode: Number;
  private service: ImageService;

  constructor(usuario: UsuarioDto, organizationCode: number) {
    this.usuario = usuario;
    this.organizationCode = organizationCode;
    this.service = new ImageService();
  }

  private async verify(data: PedidoResponse) {
    const successfully = Array.isArray(data.Mensagens);

    if (!successfully) {
      return;
    }

    await this.save(data.Resultado);
  }

  private async save(municipios) {
    try {
      await this.service.save(municipios);
    } catch (error) {
      const er = error as Error;
      Alert.alert(`${er.name}`, `${er.message}`);
    }
  }

  async runSync() {

    // const data = await ApiInstace.openUrl({
    //   data: undefined,
    //   method: 'get',
    //   endPoint: `/arc/produto/imagem/all`,
    //   headers: {
    //     Auth: this.usuario.Hash,
    //     Empresa: this.organizationCode,
    //   },
    // });

    // await this.verify(data);
  }
}
