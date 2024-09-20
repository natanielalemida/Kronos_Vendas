import PedidoMapper from '../mapper/mapperPedido';
import PedidoRepository from '../repository/pedidoRepository';
import {VendaDto} from '../type';

export default class PedidoService {
  private repository: PedidoRepository;
  private mapper: PedidoMapper;

  constructor() {
    this.repository = new PedidoRepository();
    this.mapper = new PedidoMapper();
  }

  async updateOne(id: number, pedido: VendaDto) {
    try {
      const pedidoFormatted = this.mapper.saveOne(pedido);
      await this.repository.updatePedido(pedidoFormatted.Pedido, id);

      await this.repository.updateVinculoProduto(
        pedidoFormatted.ProdutosRelacao,
        id,
      );

      await this.repository.updateVinculoMeioPagamento(
        pedidoFormatted.MeioPagamentoRelacao,
        id,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async save(pedidos: VendaDto[]) {
    const formattedMunicipios = pedidos.map(pedido =>
      this.mapper.saveOne(pedido),
    );
    const pedidosData = formattedMunicipios.map(pedido => pedido.Pedido);
    await this.repository.savePedidosBatch(pedidosData);

    const vinculoProdutoData = formattedMunicipios.flatMap(
      pedido => pedido.ProdutosRelacao,
    );

    await this.repository.saveVinculoProdutoBatch(vinculoProdutoData);

    const MeioPagamentoRelacao = formattedMunicipios.flatMap(
      pedido => pedido.MeioPagamentoRelacao,
    );
    await this.repository.saveVinculoPagamentoBatch(MeioPagamentoRelacao);

    // Caso contrário, continue salvando um a um em paralelo:
    // await Promise.all(
    //   formattedMunicipios.map(async formatedMunicipio => {
    //     await this.repository.save(formatedMunicipio);
    //   }),
    // );
  }
}
