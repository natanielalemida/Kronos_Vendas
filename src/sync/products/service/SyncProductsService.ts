import ProdutoMapper from '../mapper/produtoMapper';
import ProdutoRepository from '../repository/produtosRepository';
import {ProdutoDto} from '../type';

export default class SyncProductsService {
  private repository: ProdutoRepository;
  private mapper: ProdutoMapper;

  constructor() {
    this.repository = new ProdutoRepository();
    this.mapper = new ProdutoMapper();
  }

  async saveProducts(produtos: ProdutoDto[], batchSize = 10) {
    // Divide os produtos em lotes do tamanho batchSize
    for (let i = 0; i < produtos.length; i += batchSize) {
      const batch = produtos.slice(i, i + batchSize);
      const mappedBatch = await Promise.all(
        batch.map(produto => this.mapper.mapOne(produto)),
      );
      await this.repository.saveProdutos(mappedBatch); // Salvando em lotes
    }
  }
}
