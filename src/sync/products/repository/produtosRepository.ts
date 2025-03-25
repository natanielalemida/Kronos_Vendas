import {knexConfig} from '../../../database/connection';
import {ProdutoDto} from '../type';

export default class ProdutoRepository {
  async saveProdutos(produtos: ProdutoDto[]) {
    await knexConfig('produtos').insert(produtos);
  }

  async getProdutos(
    textFilter?: string,
  ): Promise<{data: ProdutoDto[]; total: number}> {
    // Cria a base da query
    const query = knexConfig('produtos')
      .select('*')
      .leftJoin('produto_imagem', 'produto_imagem.CodigoProduto', 'produtos.Codigo')
      .limit(50)
      .orderBy('produtos.Descricao');

    // Adiciona o filtro se estiver presente
    if (textFilter && textFilter.length > 0) {
      query.andWhereRaw('LOWER(produtos.Descricao) LIKE ?', [
        `%${textFilter.toLowerCase()}%`,
      ]);
    }


    // Obtém os dados filtrados
    const data = await query;
    
    const result = data.reduce((acc, product) => {
      const existingProduct = acc.find(p => p.CodigoProduto === product.CodigoProduto);
    
      const image = {
        path: product.Image,
        isDefault: product.IsDefault === 1, 
      };
    
      if (existingProduct) {
        existingProduct.images.push(image);
      } else {
        acc.push({
          Codigo: product.Codigo,
          CodigoProduto: product.CodigoProduto,
          Descricao: product.Descricao,
          ValorVenda: product.ValorVenda,
          CodigoDeBarras: product.CodigoDeBarras,
          UnidadeMedida: product.UnidadeMedida,
          ValorVendaAtacado: product.ValorVendaAtacado,
          images: [image],
        });
      }
    
      return acc;
    }, []);
    

    // Obtém o total de registros sem filtro
    const totalResult = await knexConfig('produtos')
      .count('* as count')
      .first();
    const total = totalResult || 0;

    return {data: result, total};
  }
}
