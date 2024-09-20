import {useState} from 'react';
import ProdutoRepository from '../../../../../../../sync/products/repository/produtosRepository';
import {ProdutoDto} from '../../../../../../../sync/products/type';

export default function UseGetProdutos() {
  const produtoRepository = new ProdutoRepository();

  const [isLoading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoDto[]>([]);

  const handleGetProdutos = async (textFilter?: string) => {
    setLoading(true);
    const data = await produtoRepository.getProdutos(textFilter);
    setProdutos([...data.data]);
    setLoading(false);
  };

  return {
    handleGetProdutos,
    setLoading,
    produtos,
    isLoading,
  };
}
