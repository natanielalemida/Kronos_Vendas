import {useState} from 'react';
import ProdutoRepository from '../../../../../sync/products/repository/produtosRepository';
import {ProdutoDto} from '../../../../../sync/products/type';

export default function UseGetProdutos() {
  const produtoRepository = new ProdutoRepository();

  const [isLoading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoDto[]>([]);
  const [produto, setProduto] = useState<ProdutoDto>();

  const handleGetProdutos = async (textFilter?: string) => {
    setLoading(true);
    const data = await produtoRepository.getProdutos(textFilter);
    setProdutos([...data.data]);
    setLoading(false);
  };

  const getProdutoById = async (codigoProduto: string) => {
    setLoading(true);
    const data = await produtoRepository.getById(codigoProduto);
    setProduto(data);
    setLoading(false);
  };

  return {
    handleGetProdutos,
    setLoading,
    produtos,
    isLoading,
    getProdutoById,
    produto
  };
}
