import {Alert} from 'react-native';
import ApiInstace from '../../api/ApiInstace';
import {UsuarioDto} from '../../modules/login/hooks/type';
import PedidoService from './service/pedidoSyncService';
import {PedidoResponse, VendaDto} from './type';

export default class SincronizarPedidos {
  private usuario: UsuarioDto;
  private organizationCode: Number;
  private service: PedidoService;

  constructor(usuario: UsuarioDto, organizationCode: number) {
    this.usuario = usuario;
    this.organizationCode = organizationCode;
    this.service = new PedidoService();
  }

  private async verify(data: PedidoResponse) {
    console.log({data});
    const successfully = Array.isArray(data.Mensagens);
    console.log({successfully});
    if (!successfully) {
      return;
    }

    await this.save(data.Resultado);
  }

  private async save(municipios: VendaDto[]) {
    try {
      await this.service.save(municipios);
    } catch (error) {
      const er = error as Error;
      Alert.alert(`${er.name}`, `${er.message}`);
    }
  }

  async runSync() {
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year} 00:00:00`;
    }

    const hoje = new Date();
    const dataFinal = formatDate(hoje);

    const dataInicial = new Date(hoje);
    dataInicial.setDate(hoje.getDate() - 30);
    const dataInicialFormatada = formatDate(dataInicial);

    const data = await ApiInstace.openUrl({
      data: undefined,
      method: 'get',
      endPoint: `arc/operacao/prevenda?DataInicial=${encodeURIComponent(
        dataInicialFormatada,
      )}&DataFinal=${encodeURIComponent(dataFinal)}&CodigoVendedor=${
        this.usuario.Codigo
      }`,
      headers: {
        Auth: this.usuario.Hash,
        Empresa: this.organizationCode,
      },
    });

    await this.verify(data);
  }
}
