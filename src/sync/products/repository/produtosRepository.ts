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

    // Obtém o total de registros sem filtro
    const totalResult = await knexConfig('produtos')
      .count('* as count')
      .first();
    const total = totalResult || 0;

    return {data, total};
  }
}
