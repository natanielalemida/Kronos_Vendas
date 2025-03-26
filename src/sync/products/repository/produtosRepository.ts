import {knexConfig} from '../../../database/connection';
import {ProdutoDto} from '../type';

export default class ProdutoRepository {
  async saveProdutos(produtos: ProdutoDto[]) {
    await knexConfig('produtos').insert(produtos);
  }

  async getProdutos(
    textFilter?: string,
  ): Promise<{data: ProdutoDto[]; total: number}> {
    // Primeiro busca todos os produtos (independente de ter imagem)
    const produtosQuery = knexConfig('produtos')
      .select('produtos.*')
      .limit(50)
      .orderBy('produtos.Descricao');
  
    // Adiciona o filtro se estiver presente
    if (textFilter && textFilter.length > 0) {
      produtosQuery.andWhereRaw('LOWER(produtos.Descricao) LIKE ?', [
        `%${textFilter.toLowerCase()}%`,
      ]);
    }
  
    // Busca os produtos
    const produtos = await produtosQuery;
  
    // Agora busca as imagens separadamente
    const imagensQuery = knexConfig('produto_imagem')
      .select('*')
      .whereIn('CodigoProduto', produtos.map(p => p.Codigo));
  
    const imagens = await imagensQuery;
  
    // Combina os dados
    const result = produtos.map(produto => {
      const imagensDoProduto = imagens
        .filter(img => img.CodigoProduto === produto.Codigo)
        .map(img => ({
          path: img.Image,
          isDefault: img.IsDefault === 1,
        }));
  
      return {
        Codigo: produto.Codigo,
        CodigoProduto: produto.Codigo,
        Descricao: produto.Descricao,
        ValorVenda: produto.ValorVenda,
        CodigoDeBarras: produto.CodigoDeBarras,
        UnidadeMedida: produto.UnidadeMedida,
        ValorVendaAtacado: produto.ValorVendaAtacado,
        Estoque: produto.Estoque || 0, // Adicionei estoque que estava faltando
        images: imagensDoProduto, // Pode ser array vazio
      };
    });
  
    return {
      data: result,
      total: result.length,
    };
  }

  async getById(codigoProduto: string): Promise<ProdutoDto | null> {
    try {
      // Busca o produto pelo código
      const produto = await knexConfig('produtos')
        .select('*')
        .where('Codigo', codigoProduto)
        .first();
  
      if (!produto) {
        return null;
      }
  
      // Busca as imagens do produto
      const imagens = await knexConfig('produto_imagem')
        .select('*')
        .where('CodigoProduto', codigoProduto);
  
      // Formata o objeto de retorno
      const produtoCompleto = {
        Codigo: produto.Codigo,
        Descricao: produto.Descricao,
        ValorVenda: produto.ValorVenda,
        CodigoDeBarras: produto.CodigoDeBarras,
        UnidadeMedida: produto.UnidadeMedida,
        ValorVendaAtacado: produto.ValorVendaAtacado,
        VendeProdutoNoAtacado: produto.VendeProdutoNoAtacado === 1,
        Estoque: produto.Estoque || 0,
        images: imagens.map(img => ({
          path: img.Image,
          isDefault: img.IsDefault === 1,
        })),
      };
  
      return produtoCompleto;
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  }
}
