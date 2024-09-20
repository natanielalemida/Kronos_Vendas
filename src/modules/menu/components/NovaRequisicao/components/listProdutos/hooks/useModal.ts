import {useState} from 'react';
import {ProdutoDto} from '../../../../../../../sync/products/type';

export default function UseModal() {
  const [isActive, setIsActive] = useState<boolean>(false);

  const [produtoModal, setProdutoModal] = useState<ProdutoDto | undefined>();
  const handleOpenModal = (produto: ProdutoDto) => {
    setProdutoModal(produto);
    setIsActive(!isActive);
  };

  return {
    isActive,
    produtoModal,
    setIsActive,
    handleOpenModal,
  };
}
