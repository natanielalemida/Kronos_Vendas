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

  async saveProdutcts(produtos: ProdutoDto[]) {
    await Promise.all(
      produtos.map(async produto => {
        await this.save(produto);
      }),
    );
  }

  private async save(produto: ProdutoDto) {
    const result = await this.mapper.mapOne(produto);
    await this.repository.saveProduto(result);
  }
}
