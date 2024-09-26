import {useState} from 'react';
import {ProdutoDto} from '../../../../../../../sync/products/type';

export default function UseModal() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isAtacado, setAtacado] = useState<boolean>(false);
  const [canSetAtacado, setCanSetAtacado] = useState<boolean>(false);

  const [produtoModal, setProdutoModal] = useState<ProdutoDto | undefined>();
  const handleOpenModal = (
    produto: ProdutoDto,
    isAtacado: boolean,
    value: boolean,
  ) => {
    setProdutoModal(produto);
    setIsActive(!isActive);
    setAtacado(isAtacado);
    setCanSetAtacado(value);
  };

  return {
    isActive,
    produtoModal,
    isAtacado,
    canSetAtacado,
    setCanSetAtacado,
    setAtacado,
    setIsActive,
    handleOpenModal,
  };
}
