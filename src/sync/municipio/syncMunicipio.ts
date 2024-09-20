import {Alert} from 'react-native';
import ApiInstace from '../../api/ApiInstace';
import {UsuarioDto} from '../../modules/login/hooks/type';
import MunicipioService from './service/municipioService';
import {MunicipioDto, MunicipioResultado} from './type/municipioType';

export default class SincronizarMunicipios {
  private usuario: UsuarioDto;
  private organizationCode: Number;
  private service: MunicipioService;

  constructor(usuario: UsuarioDto, organizationCode: number) {
    this.usuario = usuario;
    this.organizationCode = organizationCode;
    this.service = new MunicipioService();
  }

  private async verify(data: MunicipioResultado) {
    const successfully = Array.isArray(data.Mensagens);
    if (!successfully) {
      throw new Error('Falha ao sincronizar municipios');
    }

    await this.save(data.Resultado);
  }

  private async save(municipios: MunicipioDto[]) {
    try {
      await this.service.save(municipios);
    } catch (error) {
      const er = error as Error;
      Alert.alert(`${er.name}`, `${er.message}`);
    }
  }

  async runSync() {
    const data = await ApiInstace.openUrl({
      data: undefined,
      method: 'get',
      endPoint: 'arc/endereco/municipio',
      headers: {
        Auth: this.usuario.Hash,
        Empresa: this.organizationCode,
      },
    });

    await this.verify(data);
  }
}
