import {useEffect, useState} from 'react';
import {
  ProdutoBodyCreateQtAndObsDto,
  ProdutoDto,
} from '../../../../../../../sync/products/type';
import {colors} from '../../../../../../styles';
import {useCliente} from '../../../../Clientes/context/clientContext';
import {UseSetSelectedsType} from '../type';

export default function UseSetSelecteds({
  setIsActive,
  setObservacao,
  setQuantidade,
  cleanForm,
  produto,
  isActive,
}: UseSetSelectedsType) {
  const {ProdutosSelecionados, setProdutosSelecionados} = useCliente();
  const [selectedProduto, setSelectedProduto] = useState<ProdutoDto>();

  const handleSetProduto = (produto: ProdutoBodyCreateQtAndObsDto) => {
    setProdutosSelecionados(oldValue => [...oldValue, produto]);
  };

  const handleVerify = () => {
    if (setObservacao && setQuantidade) {
      setObservacao('');
      setQuantidade(1);
    }
    const findedProduto = ProdutosSelecionados.find(
      produtoFind => produtoFind.Codigo === produto?.Codigo,
    );

    if (findedProduto && setObservacao && setQuantidade) {
      setSelectedProduto(findedProduto);
      setObservacao(findedProduto.Observacao);
      setQuantidade(findedProduto.Quantidade);
      return;
    }
    setSelectedProduto(produto);
  };

  useEffect(() => {
    handleVerify();
  }, [isActive]);

  const addQuantidadeAndObsToProduct = (
    produto: ProdutoDto,
    quantidade: number,
    observacao: string,
    valorVenda: string,
    valorProduto: string,
  ) => {
    const produtoExistenteIndex = ProdutosSelecionados.findIndex(
      produtoSelecionado => produtoSelecionado.Codigo === produto.Codigo,
    );

    if (produtoExistenteIndex !== -1) {
      // Produto já existe, atualize a quantidade e observação
      const ProdutosAtualizados = [...ProdutosSelecionados];
      ProdutosAtualizados[produtoExistenteIndex] = {
        ...ProdutosSelecionados[produtoExistenteIndex],
        Quantidade: quantidade,
        Observacao: observacao,
        ValorVendaDesconto: Number(valorVenda),
        ValorVenda: parseFloat(valorProduto),
      };
      setProdutosSelecionados(ProdutosAtualizados);
    } else {
      // Produto não existe, adicione-o
      setProdutosSelecionados([
        ...ProdutosSelecionados,
        {
          ...produto,
          Quantidade: quantidade,
          Observacao: observacao,
          ValorVendaDesconto: Number(valorVenda),
          ValorVenda: parseFloat(valorProduto),
        },
      ]);
    }

    if (cleanForm) {
      cleanForm();
    }
    if (setIsActive) {
      setIsActive(false);
    }
  };

  const findIndex = (produto: ProdutoDto) => {
    const index = ProdutosSelecionados.findIndex(
      produtoSelecioado => produtoSelecioado.Codigo === produto.Codigo,
    );
    const color = index !== -1 ? colors.arcGreen400 : undefined;
    return color;
  };

  return {
    ProdutosSelecionados,
    selectedProduto,
    addQuantidadeAndObsToProduct,
    handleSetProduto,
    findIndex,
  };
}
