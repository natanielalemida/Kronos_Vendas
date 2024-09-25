import {Alert} from 'react-native';
import ApiInstace from '../../api/ApiInstace';
import {UsuarioDto} from '../../modules/login/hooks/type';
import SyncProductsService from './service/SyncProductsService';
import {ProdutoDto, ResultadoDto} from './type';

export default class SincronizarProdutos {
  private usuario: UsuarioDto;
  private organizationCode: Number;
  private service: SyncProductsService;

  constructor(usuario: UsuarioDto, organizationCode: number) {
    this.usuario = usuario;
    this.organizationCode = organizationCode;
    this.service = new SyncProductsService();
  }

  private async verify(data: ResultadoDto) {
    const successfully = Array.isArray(data.Mensagens);
    if (!successfully) {
      throw new Error('Falha ao sincronizar produtos');
    }

    await this.save(data.Resultado);
  }

  private async save(produtos: ProdutoDto[]) {
    try {
      await this.service.saveProducts(produtos);
    } catch (error) {
      const er = error as Error;
      Alert.alert(`${er.name}`, `${er.message}`);
    }
  }

  async runSync() {
    const data = await ApiInstace.openUrl({
      data: undefined,
      method: 'get',
      endPoint: 'arc/produto/vendas/mobile',
      headers: {
        Auth: this.usuario.Hash,
        Empresa: this.organizationCode,
      },
    });

    await this.verify(data);
  }
}
