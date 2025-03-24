import ImageRepository from "../repository/ImageRepository";

export default class ImageService {
  private repository: ImageRepository;

  constructor() {
    this.repository = new ImageRepository();
  }

  async updateOne(id: number, pedido) {
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
      console.error(error);
    }
  }

  async save(pedidos) {

    await this.repository.saveVinculoProdutoBatch(pedidos);

  }
}
